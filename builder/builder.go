package builder

import (
	"fmt"
	"github.com/abarbarov/nabu/github"
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
	outClose(messages, fmt.Sprintf("unzipping files"), 4)

	//fullName := fmt.Sprintf("%s-%s-%s", owner, name, sha)
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
