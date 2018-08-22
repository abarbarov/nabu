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
	Github *github.Github
}

func (b *Builder) Build(token, owner, name, branch, sha string, messages chan *Message) {

	go outOk(messages, "build started", false, 0)

	zip, err := b.Github.Archive(token, owner, name, branch, sha)

	if err != nil {
		go outErr(messages, fmt.Sprintf("%v", err), true, 2)
		return
	}

	go outOk(messages, fmt.Sprintf("archive downloaded to %v", zip), true, 2)

}

func outOk(messages chan *Message, text string, close bool, id int64) {
	messages <- &Message{
		Id:        id,
		Status:    1,
		Text:      text,
		Timestamp: time.Now(),
		Close:     close,
	}
}

func outErr(messages chan *Message, text string, close bool, id int64) {
	messages <- &Message{
		Id:        id,
		Status:    2,
		Text:      text,
		Timestamp: time.Now(),
		Close:     close,
	}
}
