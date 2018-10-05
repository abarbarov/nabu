package store

import (
	"github.com/pkg/errors"
	"strings"
)

type User struct {
	Id   int64
	Name string
	Hash string
}

var users = []*User{
	{
		Id:   1,
		Name: "admin",
		Hash: "password",
	},
	{
		Id:   2,
		Name: "firstfile",
		Hash: "password",
	},
}

func (ds *DataStore) Users() ([]*User, error) {
	return users, nil
}

func (ds *DataStore) User(username string) (*User, error) {

	for _, u := range users {
		if strings.EqualFold(u.Name, username) {
			return u, nil
		}
	}

	return nil, nil
}

func (ds *DataStore) AddUser(username, password string) (*User, error) {
	user, _ := ds.User(username)
	if user != nil {
		return nil, errors.New("Duplicate username")
	}

	newUser := &User{
		Id:   int64(len(users)) + 1,
		Hash: password,
		Name: username,
	}

	users = append(users, newUser)

	return newUser, nil
}
