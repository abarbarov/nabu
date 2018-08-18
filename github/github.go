package github

import (
	"context"
	"github.com/google/go-github/github"
	"golang.org/x/oauth2"
	"time"
)

type Branch struct {
	Name string
}

type Commit struct {
	Message string
	SHA     string
	Date    time.Time
}

type Github struct {
}

func (g *Github) Branches(token, owner, name string) (data []*Branch, err error) {

	ctx := context.Background()
	ts := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: token})
	oauth := oauth2.NewClient(ctx, ts)
	client := github.NewClient(oauth)

	branches, _, err := client.Repositories.ListBranches(context.Background(), owner, name, nil)

	if err != nil {
		return nil, err
	}

	for _, element := range branches {
		elem := &Branch{
			*element.Name,
		}

		data = append(data, elem)
	}

	return data, nil
}

func (g *Github) Commits(token, owner, name, branch string) (data []Commit, err error) {

	ctx := context.Background()
	ts := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: token})
	oauth := oauth2.NewClient(ctx, ts)
	client := github.NewClient(oauth)

	commits, _, err := client.Repositories.ListCommits(context.Background(), owner, name, &github.CommitsListOptions{SHA: branch})

	if err != nil {
		return nil, err
	}

	for _, element := range commits {
		elem := Commit{
			*element.Commit.Message,
			*element.SHA,
			*element.Commit.Author.Date,
		}

		data = append(data, elem)
	}

	return data, nil
}
