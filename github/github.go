package github

import (
	"context"
	"fmt"
	"github.com/abarbarov/nabu/tools"
	"github.com/google/go-github/github"
	"golang.org/x/oauth2"
	"os"
	"path/filepath"
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

func (g *Github) Commits(token, owner, name, branch string) (chan *Commit, error) {
	output := make(chan *Commit)

	// TODO: use context with cancel
	ctx := context.Background()
	ts := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: token})
	oauth := oauth2.NewClient(ctx, ts)
	client := github.NewClient(oauth)

	commits, _, err := client.Repositories.ListCommits(context.Background(), owner, name, &github.CommitsListOptions{SHA: branch})

	if err != nil {
		return output, err
	}

	for _, commit := range commits {
		go func(commit *github.RepositoryCommit) {
			c := &Commit{
				*commit.Commit.Message,
				*commit.SHA,
				*commit.Commit.Author.Date,
			}
			output <- c
		}(commit)
	}

	return output, nil
}

func (g *Github) Archive(token, owner, name, branch, sha string) (string, error) {

	ctx := context.Background()
	ts := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: token})

	oauth := oauth2.NewClient(ctx, ts)

	githubClient := github.NewClient(oauth)

	repo, _, err := githubClient.Repositories.GetArchiveLink(ctx, owner, name, "zipball", &github.RepositoryContentGetOptions{Ref: sha})

	if err != nil {
		return "", err
	}

	repoUrl := fmt.Sprintf("https://%s%s?login=%s&%s", repo.Host, repo.Path, owner, repo.RawQuery)

	ex, err := os.Executable()
	if err != nil {
		return "", err
	}
	exPath := filepath.Dir(ex)
	zipFolder := filepath.Join(exPath, "nabu-builds")

	tools.MakeDirs(zipFolder)

	localZipPath := filepath.Join(zipFolder, fmt.Sprintf("%s.zip", name))
	if err = tools.DownloadFile(localZipPath, repoUrl); err != nil {
		return "", err
	}

	return localZipPath, nil
}
