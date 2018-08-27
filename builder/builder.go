package builder

import (
	"archive/zip"
	"bytes"
	"fmt"
	"github.com/abarbarov/nabu/github"
	"github.com/pkg/errors"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"time"
)

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

func (b *Builder) Build(token, owner, name, branch, sha string, messages chan *Message) {

	outOk(messages, "[INFO] build started", 0)

	zip, err := b.Github.Archive(token, owner, name, branch, sha, b.BuildOutput)

	if err != nil {
		outErr(messages, fmt.Sprintf("[ERR] %v", err), 1)
		return
	}

	outOk(messages, fmt.Sprintf("[INFO] archive downloaded to %v", zip), 2)

	err = unzipFiles(zip, b.BuildOutput)

	if err != nil {
		outErr(messages, fmt.Sprintf("[ERR] %v", err), 4)
		return
	}

	outOk(messages, fmt.Sprintf("[INFO] files unzipped, building application..."), 4)

	fullName := fmt.Sprintf("%s-%s-%s", owner, name, sha)
	buildPath := filepath.Join(b.BuildOutput, fullName)
	err = b.vgoBuild(buildPath)

	if err != nil {
		outErr(messages, fmt.Sprintf("[ERR] %v", err), 6)
		return
	}

	outClose(messages, fmt.Sprintf("[INFO] app built"), 6)

}

func (b *Builder) Copy(owner, name, sha string, messages chan *Message) {

	outOk(messages, "[INFO] copying started...", 0)

	fullName := fmt.Sprintf("%s-%s-%s", owner, name, sha)
	buildPath := filepath.Join(b.BuildOutput, fullName)
	folders := []string{filepath.Join(buildPath, "static"), filepath.Join(buildPath, "data")}
	executable := filepath.Join(buildPath, "application")
	outZip := filepath.Join(buildPath, fmt.Sprintf("out-%s.zip", sha))

	outOk(messages, fmt.Sprintf("[INFO] zipping to %s", outZip), 2)

	err := zipFiles(folders, []string{executable}, outZip)

	if err != nil {
		outErr(messages, fmt.Sprintf("[ERR] zipping failed: %+v", err), 4)
		return
	}

	outClose(messages, fmt.Sprintf("[INFO] app copied"), 6)
}

func (b *Builder) vgoBuild(dir string) error {

	args := []string{"build", "-o", "application"}
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
	ziparchive, err := os.Create(target)
	if err != nil {
		return err
	}
	defer ziparchive.Close()

	zipWriter := zip.NewWriter(ziparchive)
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
