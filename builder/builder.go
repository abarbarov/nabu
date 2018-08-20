package builder

import (
	"fmt"
	"github.com/abarbarov/nabu/github"
)

type Message struct {
	Id     int64
	Text   string
	Status int
}

type Builder struct {
	Github *github.Github
}

func (b *Builder) Build(token, owner, name, branch, sha string) (chan *Message, error) {
	messages := make(chan *Message)

	go func(m *Message) { messages <- m }(&Message{Id: 1, Status: 1, Text: "build started"})

	zip, err := b.Github.Archive(token, owner, name, branch, sha)

	if err != nil {
		go func(m *Message) { messages <- m }(&Message{Id: 2, Status: 2, Text: fmt.Sprintf("%v", err)})
		return messages, err
	}

	go func(m *Message) { messages <- m }(&Message{Id: 3, Status: 1, Text: fmt.Sprintf("archive downloaded to %v", zip)})
	return messages, nil
}
