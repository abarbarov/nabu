package builder

type Message struct {
	Id     int64
	Text   string
	Status int
}

type Builder struct {
}

func (b *Builder) Build(token, owner, name, branch, sha string) (chan *Message, error) {
	output := make(chan *Message)

	m := download()

	go func(m *Message) {
		output <- m
	}(m)

	return output, nil
}

func download() *Message {
	return &Message{
		Id:     2,
		Status: 1,
		Text:   "Starting download",
	}
}
