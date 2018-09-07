package github

import (
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"testing"
)

func TestGithub_Commits(t *testing.T) {
	gh := Github{}
	ghtoken := "dc374e4fc6a6c4912bb7599aaf4b138f0d942227"
	commits, err := gh.Commits(ghtoken, "abarbarov", "trademark.web", "master")

	require.Nil(t, err)
	commitsAvailable := 0
	for range commits {
		commitsAvailable++
		close(commits)
	}

	assert.NotEqual(t, 0, commitsAvailable)
}

func TestGithub_Branches(t *testing.T) {
	gh := Github{}
	ghtoken := "dc374e4fc6a6c4912bb7599aaf4b138f0d942227"
	branches, err := gh.Branches(ghtoken, "abarbarov", "trademark.web")

	require.Nil(t, err)
	assert.NotEqual(t, 0, len(branches))

	hasMasterBranch := false
	for b := range branches {
		if b.Name == "master" {
			hasMasterBranch = true
			close(branches)
		}
	}

	assert.Equal(t, true, hasMasterBranch)
}
