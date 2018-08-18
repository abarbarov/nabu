package store

import (
	"errors"
	"time"
)

type Repository struct {
	Id    int64
	Title string
	Owner string
}

type Commit struct {
	Id        int64
	SHA       string
	Timestamp time.Time
}

func (s *DataStore) Commits(repositoryId int64, branch string) ([]*Commit, error) {
	switch repositoryId {
	case 1:
		var commits []*Commit
		commits = append(commits, &Commit{
			Id:        1,
			SHA:       "1abcdef",
			Timestamp: time.Now(),
		})

		return commits, nil
	case 2:
		var commits []*Commit
		commits = append(commits, &Commit{
			Id:        10,
			SHA:       "10abcdef",
			Timestamp: time.Now(),
		})
		commits = append(commits, &Commit{
			Id:        11,
			SHA:       "11abcdef",
			Timestamp: time.Now(),
		})

		return commits, nil

	case 3:
		var commits []*Commit
		commits = append(commits, &Commit{
			Id:        100,
			SHA:       "100abcdef",
			Timestamp: time.Now(),
		})
		commits = append(commits, &Commit{
			Id:        101,
			SHA:       "101abcdef",
			Timestamp: time.Now(),
		})

		return commits, nil
	default:
		return nil, errors.New("no commits found")
	}
}
