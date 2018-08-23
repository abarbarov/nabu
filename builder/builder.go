package builder

import (
	"archive/zip"
	"fmt"
	"github.com/abarbarov/nabu/github"
	"io"
	"os"
	"path/filepath"
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
	Github      *github.Github
	BuildOutput string
}

func (b *Builder) Build(token, owner, name, branch, sha string, messages chan *Message) {

	outOk(messages, "build started", 0)

	zip, err := b.Github.Archive(token, owner, name, branch, sha, b.BuildOutput)

	if err != nil {
		outErr(messages, fmt.Sprintf("%v", err), 1)
		return
	}

	outOk(messages, fmt.Sprintf("archive downloaded to %v", zip), 2)

	err = unzipFiles(zip, b.BuildOutput)

	if err != nil {
		outErr(messages, fmt.Sprintf("%v", err), 4)
		return
	}

	outClose(messages, fmt.Sprintf("files unzipped"), 4)

	//fullName := fmt.Sprintf("%s-%s-%s", owner, name, sha)
	//buildPath := filepath.Join(b.BuildOutput, fullName)
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
