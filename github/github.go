package github

import (
	"context"
	"fmt"
	"github.com/abarbarov/nabu/tools"
	"github.com/google/go-github/github"
	"golang.org/x/oauth2"
	"path/filepath"
	"time"
)

type Commit struct {
	Message string
	SHA     string
	Date    time.Time
}

type Branch struct {
	Name string
}

type Github struct {
}

func (g *Github) Branches(token, owner, name string) ([]*Branch, error) {
	var ctx context.Context
	var cancel context.CancelFunc

	ctx, cancel = context.WithTimeout(context.Background(), time.Second*30)
	defer cancel()

	ts := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: token})
	oauth := oauth2.NewClient(ctx, ts)
	client := github.NewClient(oauth)

	branches, _, err := client.Repositories.ListBranches(context.Background(), owner, name, nil)

	if err != nil {
		return nil, err
	}

	var output []*Branch
	for _, branch := range branches {
		output = append(output, &Branch{Name: *branch.Name})
	}

	return output, nil
}

func (g *Github) Commits(token, owner, name, branch string) ([]*Commit, error) {
	var ctx context.Context
	var cancel context.CancelFunc

	ctx, cancel = context.WithTimeout(context.Background(), time.Second*30)
	defer cancel()

	ts := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: token})
	oauth := oauth2.NewClient(ctx, ts)
	client := github.NewClient(oauth)

	commits, _, err := client.Repositories.ListCommits(context.Background(), owner, name, &github.CommitsListOptions{SHA: branch})

	if err != nil {
		return nil, err
	}

	var output []*Commit
	for _, c := range commits {
		output = append(output, &Commit{
			Message: *c.Commit.Message,
			SHA:     *c.SHA,
			Date:    *c.Commit.Author.Date,
		})
	}

	return output, nil
}

func (g *Github) Archive(token, owner, name, branch, sha, downloadsDir string) (string, error) {

	ctx := context.Background()
	ts := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: token})

	oauth := oauth2.NewClient(ctx, ts)

	githubClient := github.NewClient(oauth)

	repo, _, err := githubClient.Repositories.GetArchiveLink(ctx, owner, name, "zipball", &github.RepositoryContentGetOptions{Ref: sha})

	if err != nil {
		return "", err
	}

	repoUrl := fmt.Sprintf("https://%s%s?login=%s&%s", repo.Host, repo.Path, owner, repo.RawQuery)

	localZipPath := filepath.Join(downloadsDir, fmt.Sprintf("%s.zip", name))
	if err = tools.DownloadFile(localZipPath, repoUrl); err != nil {
		return "", err
	}

	return localZipPath, nil
}
