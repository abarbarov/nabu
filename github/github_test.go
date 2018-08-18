package github

import (
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"testing"
)

func TestGithub_Commits(t *testing.T) {
	gh := Github{}
	ghtoken := "d14813a8df45fa3d136e3fd6690a49b780268978"
	commits, err := gh.Commits(ghtoken, "abarbarov", "trademark.web", "master")

	require.Nil(t, err)
	assert.NotEqual(t, 0, len(commits))
}

func TestGithub_Branches(t *testing.T) {
	gh := Github{}
	ghtoken := "d14813a8df45fa3d136e3fd6690a49b780268978"
	branches, err := gh.Branches(ghtoken, "abarbarov", "trademark.web")

	require.Nil(t, err)
	assert.NotEqual(t, 0, len(branches))

	hasMasterBranch := false
	for _, b := range branches {
		if b.Name == "master" {
			hasMasterBranch = true
		}
	}

	assert.Equal(t, true, hasMasterBranch)
}
