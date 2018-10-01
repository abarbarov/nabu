package builder

import (
	"archive/zip"
	"bytes"
	"fmt"
	"github.com/abarbarov/nabu/github"
	"github.com/abarbarov/nabu/store"
	"github.com/abarbarov/nabu/tools"
	"github.com/pkg/errors"
	"github.com/pkg/sftp"
	"golang.org/x/crypto/ssh"
	"io"
	"io/ioutil"
	"os"
	"os/exec"
	"path"
	"path/filepath"
	"runtime"
	"strings"
	"time"
)

const PACKET_SIZE = 1 << 15

type Message struct {
	Id        int64
	Timestamp time.Time
	Text      string
	Status    int
	Close     bool
}

type Builder struct {
	Github       *github.Github
	BuildOutput  string
	GoExecutable string
}

func findFullName(output, name string) (string, error) {
	fullName := ""
	err := filepath.Walk(output, func(path string, info os.FileInfo, err error) error {
		//files = append(files, path)
		if info.IsDir() {
			if strings.HasPrefix(info.Name(), name) {
				fullName = info.Name()
				return io.EOF
			}
		}
		return nil
	})

	if err == io.EOF {
		err = nil
	}
	return fullName, err
}

func (b *Builder) Build(token, owner, name, branch, sha string, messages chan *Message) {

	outOk(messages, "[INFO] build started", 0)

	sourcesZip, err := b.Github.Archive(token, owner, name, branch, sha, b.BuildOutput)

	if err != nil {
		outErr(messages, fmt.Sprintf("[ERR] %v", err), 2)
		return
	}

	outOk(messages, fmt.Sprintf("[INFO] archive downloaded to %v", sourcesZip), 2)

	err = unzipFiles(sourcesZip, b.BuildOutput)

	if err != nil {
		outErr(messages, fmt.Sprintf("[ERR] %v", err), 4)
		return
	}

	outOk(messages, fmt.Sprintf("[INFO] files unzipped, building application..."), 4)
	fullName, err := findFullName(b.BuildOutput, fmt.Sprintf("%s-%s-%s", owner, name, tools.Substr(sha, 0, 7)))

	if err != nil {
		outErr(messages, fmt.Sprintf("[ERR] Cannot find unzipped folder %v", err), 6)
		return
	}

	buildPath := filepath.Join(b.BuildOutput, fullName)
	err = b.vgoBuild(buildPath, sha)

	if err != nil {
		outErr(messages, fmt.Sprintf("[ERR] %v", err), 6)
		return
	}

	folders := []string{filepath.Join(buildPath, "static"), filepath.Join(buildPath, "data")}
	executable := filepath.Join(buildPath, "application")
	outZip := filepath.Join(buildPath, fmt.Sprintf("out-%s.zip", sha))
	outOk(messages, fmt.Sprintf("[INFO] zipping to %s", outZip), 8)

	err = zipFiles(folders, []string{executable}, outZip)

	if err != nil {
		outErr(messages, fmt.Sprintf("[ERR] zipping failed: %+v", err), 10)
		return
	}

	outClose(messages, fmt.Sprintf("[INFO] app built"), 10)
}

func (b *Builder) Copy(proj store.Project, sha string, messages chan *Message) {

	outOk(messages, "[INFO] copying started...", 0)

	fullName, err := findFullName(b.BuildOutput, fmt.Sprintf("%s-%s-%s", proj.Repository.Owner, proj.Repository.Name, tools.Substr(sha, 0, 7)))
	buildPath := filepath.Join(b.BuildOutput, fullName)
	outZip := filepath.Join(buildPath, fmt.Sprintf("out-%s.zip", sha))

	sshConfig := &ssh.ClientConfig{
		User: "dev",
		Auth: []ssh.AuthMethod{
			PrivateKeyFile(),
		},
		HostKeyCallback: ssh.InsecureIgnoreHostKey(),
	}

	connection, err := ssh.Dial("tcp", proj.Host, sshConfig)
	if err != nil {
		outErr(messages, fmt.Sprintf("[ERR] ssh connection failed: %+v", err), 6)
		return
	}
	defer connection.Close()

	if err := copyOverSSH(connection, outZip); err != nil {
		outErr(messages, fmt.Sprintf("[ERR] copy to remote server failed: %+v", err), 8)
		return
	}

	out, err := extractZipOverSSH(connection, outZip)

	if err != nil {
		outErr(messages, fmt.Sprintf("[ERR] copy to remote server failed: %+v", err), 10)
		return
	}
	outOk(messages, fmt.Sprintf("[INFO] %+v", out), 10)

	outClose(messages, fmt.Sprintf("[INFO] app copied"), 12)
}

func (b *Builder) Install(proj store.Project, sha, color string, messages chan *Message) {

	outOk(messages, fmt.Sprintf("[INFO] installing %s-%s started...", sha, color), 0)

	fullName, err := findFullName(b.BuildOutput, fmt.Sprintf("%s-%s-%s", proj.Repository.Owner, proj.Repository.Name, tools.Substr(sha, 0, 7)))
	staticAssetsPath := filepath.Join(b.BuildOutput, fullName, "static")

	remoteBuildDir := fmt.Sprintf("/home/dev/out-%s", sha)
	remoteServiceDir := fmt.Sprintf(proj.Dir, color)
	serviceName := fmt.Sprintf(proj.Exec, color)

	stop := fmt.Sprintf("sudo systemctl stop %s", serviceName)
	cpStatic := fmt.Sprintf("sudo cp -R %s/static %s", remoteBuildDir, remoteServiceDir)
	cpExecutable := fmt.Sprintf("sudo cp %s/application %s/app", remoteBuildDir, remoteServiceDir)
	chmodExecutable := fmt.Sprintf("sudo chmod +x %s/app", remoteServiceDir)
	restart := fmt.Sprintf("sudo systemctl restart %s", serviceName)

	sshConfig := &ssh.ClientConfig{
		User: "dev",
		Auth: []ssh.AuthMethod{
			PrivateKeyFile(),
		},
		HostKeyCallback: ssh.InsecureIgnoreHostKey(),
	}

	connection, err := ssh.Dial("tcp", proj.Host, sshConfig)
	if err != nil {
		outErr(messages, fmt.Sprintf("[ERR] ssh connection failed: %+v", err), 2)
		return
	}
	defer connection.Close()

	// 1
	if _, err := execSSH(connection, stop); err != nil {
		outErr(messages, fmt.Sprintf("[ERR] stopping service failed: %+v", err), 4)
		return
	}

	outOk(messages, fmt.Sprintf("[INFO] service stopped"), 4)

	// 2
	if _, err := execSSH(connection, cpExecutable); err != nil {
		outErr(messages, fmt.Sprintf("[ERR] copying executable failed: %+v", err), 6)
		return
	}
	outOk(messages, fmt.Sprintf("[INFO] executable copied"), 6)

	// 3
	if _, err := execSSH(connection, chmodExecutable); err != nil {
		outErr(messages, fmt.Sprintf("[ERR] changing mod +x to executable failed: %+v", err), 8)
		return
	}
	outOk(messages, fmt.Sprintf("[INFO] executable mod changed"), 8)

	// 3
	if _, err := os.Stat(staticAssetsPath); err == nil {
		// copy assets only exists
		if _, err := execSSH(connection, cpStatic); err != nil {
			outErr(messages, fmt.Sprintf("[ERR] copying static assets failed: %+v", err), 10)
			return
		}

		outOk(messages, fmt.Sprintf("[INFO] assets copied"), 10)
	}

	// 4
	if _, err := execSSH(connection, restart); err != nil {
		outErr(messages, fmt.Sprintf("[ERR] restart failed: %+v", err), 12)
		return
	}

	outClose(messages, fmt.Sprintf("[INFO] service restarted"), 14)
}

func (b *Builder) vgoBuild(dir, sha string) error {
	args := []string{"build", "-o", "application", "-ldflags", fmt.Sprintf("-X main.buildstamp=%s -X main.revision=%s", time.Now().Format(time.RFC3339), sha)}
	var cmd *exec.Cmd

	cmd = exec.Command(b.GoExecutable, args...)

	env := os.Environ()
	if runtime.GOOS == "windows" {
		env = append(env, fmt.Sprintf("GOOS=%s", "linux"))
		env = append(env, fmt.Sprintf("GOARCH=%s", "amd64"))
	}

	cmd.Env = env
	cmd.Dir, _ = filepath.Abs(dir)

	stdout := &bytes.Buffer{}
	stderr := &bytes.Buffer{}
	cmd.Stdout = stdout
	cmd.Stderr = stderr

	if err := cmd.Run(); err != nil {
		return errors.Wrapf(err, "stdout: %s\nstderr:%s\nerror: %v", stdout.String(), stderr.String(), err)
	}

	return nil
}

func outOk(messages chan *Message, text string, id int64) {
	messages <- &Message{
		Id:        id,
		Status:    1,
		Text:      text,
		Timestamp: time.Now(),
	}
}

func outClose(messages chan *Message, text string, id int64) {
	messages <- &Message{
		Id:        id,
		Status:    1,
		Text:      text,
		Timestamp: time.Now(),
		Close:     true,
	}
}

func outErr(messages chan *Message, text string, id int64) {
	messages <- &Message{
		Id:        id,
		Status:    2,
		Text:      text,
		Timestamp: time.Now(),
		Close:     true,
	}
}

func unzipFiles(src, target string) error {
	r, err := zip.OpenReader(src)
	if err != nil {
		return err
	}
	defer func() {
		if err := r.Close(); err != nil {
			panic(err)
		}
	}()

	if err := os.MkdirAll(target, 0755); err != nil {
		return err
	}

	// Closure to address file descriptors issue with all the deferred .Close() methods
	extractAndWriteFile := func(f *zip.File) error {
		rc, err := f.Open()
		if err != nil {
			return err
		}
		defer func() {
			if err := rc.Close(); err != nil {
				panic(err)
			}
		}()

		folderToExtract := filepath.Join(target, f.Name)

		if f.FileInfo().IsDir() {
			os.MkdirAll(folderToExtract, f.Mode())
		} else {
			os.MkdirAll(filepath.Dir(folderToExtract), f.Mode())
			f, err := os.OpenFile(folderToExtract, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
			if err != nil {
				return err
			}
			defer func() {
				if err := f.Close(); err != nil {
					panic(err)
				}
			}()

			_, err = io.Copy(f, rc)
			if err != nil {
				return err
			}
		}
		return nil
	}

	for _, f := range r.File {
		err := extractAndWriteFile(f)
		if err != nil {
			return err
		}
	}

	return nil
}

func zipFiles(folders []string, files []string, target string) error {
	zipArchive, err := os.Create(target)
	if err != nil {
		return err
	}
	defer zipArchive.Close()

	zipWriter := zip.NewWriter(zipArchive)
	defer zipWriter.Close()

	for _, source := range folders {

		info, err := os.Stat(source)
		if os.IsNotExist(err) {
			continue
		}

		if err != nil {
			return err
		}

		var baseDir string
		if info.IsDir() {
			baseDir = filepath.Base(source)
		}

		filepath.Walk(source, func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}

			header, err := zip.FileInfoHeader(info)
			if err != nil {
				return err
			}

			if baseDir != "" {
				header.Name = filepath.Join(baseDir, strings.TrimPrefix(path, source))
			}

			if info.IsDir() {
				header.Name += "/"
			} else {
				header.Method = zip.Deflate
			}
			header.Name = filepath.ToSlash(header.Name)

			writer, err := zipWriter.CreateHeader(header)
			if err != nil {
				return err
			}

			if info.IsDir() {
				return nil
			}

			file, err := os.Open(path)
			if err != nil {
				return err
			}
			defer file.Close()
			_, err = io.Copy(writer, file)
			return err
		})
	}

	if err != nil {
		return err
	}

	// Add files to zip
	for _, file := range files {

		zipfile, err := os.Open(file)
		if err != nil {
			continue
			//return err
		}
		defer zipfile.Close()

		// Get the file information
		info, err := zipfile.Stat()
		if err != nil {
			return err
		}

		header, err := zip.FileInfoHeader(info)
		if err != nil {
			return err
		}

		// Change to deflate to gain better compression
		header.Method = zip.Deflate

		writer, err := zipWriter.CreateHeader(header)
		if err != nil {
			return err
		}
		_, err = io.Copy(writer, zipfile)
		if err != nil {
			return err
		}
	}

	return nil
}

func PrivateKeyFile() ssh.AuthMethod {
	buffer, err := ioutil.ReadFile("/Users/abarbarov/.ssh/id_rsa")
	if err != nil {
		return nil
	}

	key, err := ssh.ParsePrivateKey(buffer)
	if err != nil {
		return nil
	}
	return ssh.PublicKeys(key)
}

func copyOverSSH(connection *ssh.Client, localZipFilePath string) error {
	session, err := connection.NewSession()
	if err != nil {
		return err
	}
	defer session.Close()

	// open an SFTP session over an existing ssh connection.
	sftpClient, err := sftp.NewClient(connection, sftp.MaxPacket(PACKET_SIZE))
	if err != nil {
		return err
	}
	defer sftpClient.Close()

	remoteZip := filepath.Base(localZipFilePath)

	localFile, err := os.Open(localZipFilePath)
	if err != nil {
		return err
	}
	defer localFile.Close()

	remoteFile, err := sftpClient.Create(fmt.Sprintf("/home/dev/%s", remoteZip))
	if err != nil {
		return err
	}
	defer remoteFile.Close()

	if _, err = io.Copy(remoteFile, localFile); err != nil {
		return err
	}

	return nil
}

func extractZipOverSSH(connection *ssh.Client, localZip string) (string, error) {
	remoteZip := filepath.Base(localZip)
	fileWithoutExt := strings.TrimSuffix(remoteZip, path.Ext(remoteZip))

	return execSSH(connection, fmt.Sprintf("cd /home/dev && unzip -o %[1]s.zip -d %[1]s", fileWithoutExt))
}

func execSSH(connection *ssh.Client, cmd string) (string, error) {
	session, err := connection.NewSession()
	if err != nil {
		return "", err
	}

	defer session.Close()

	var stdout bytes.Buffer
	var stderr bytes.Buffer

	session.Stdout = &stdout
	session.Stderr = &stderr

	if err := session.Run(cmd); err != nil {
		return "", errors.Errorf("stdout: %s\nstderr:%s\nerror: %v", stdout.String(), stderr.String(), err)
	}

	return fmt.Sprintf("%s\n%s", stdout.String(), stderr.String()), nil
}
