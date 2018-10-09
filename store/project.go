package store

type Project struct {
	Id         int64
	UserId     int64
	Title      string
	Repository *Repository
	Host       string
	Exec       string
	Dir        string
}

type Repository struct {
	Id    int64
	Name  string
	Owner string
	Token string
}

var projects = []*Project{
	{
		Id:     1,
		UserId: 1,
		Title:  "firstfile-dev",
		Repository: &Repository{
			Id:    1,
			Name:  "trademark.web",
			Owner: "abarbarov",
			Token: "dc374e4fc6a6c4912bb7599aaf4b138f0d942227",
		},
		Host: "95.216.163.61:22",
		Exec: "firstfile.%s.service",
		Dir:  "/apps/firstfile/%s",
	},
	{
		Id:     2,
		UserId: 1,
		Title:  "firstfile-PRODUCTION",
		Repository: &Repository{
			Id:    1,
			Name:  "trademark.web",
			Owner: "abarbarov",
			Token: "dc374e4fc6a6c4912bb7599aaf4b138f0d942227",
		},
		Host: "5.23.53.238:22",
		Exec: "trademark.%s.service",
		Dir:  "/apps/trademark/%s",
	},
	{
		Id:     3,
		UserId: 1,
		Title:  "nabu",
		Repository: &Repository{
			Id:    1,
			Name:  "nabu",
			Owner: "abarbarov",
			Token: "dc374e4fc6a6c4912bb7599aaf4b138f0d942227",
		},
		Host: "95.216.163.61:22",
		Exec: "nabu.%s.service",
		Dir:  "/apps/nabu/%s",
	},
	{
		Id:     4,
		UserId: 1,
		Title:  "boilerplate",
		Repository: &Repository{
			Id:    1,
			Name:  "boilerplate",
			Owner: "abarbarov",
			Token: "dc374e4fc6a6c4912bb7599aaf4b138f0d942227",
		},
		Host: "95.216.163.61:22",
		Exec: "nabu.%s.service",
		Dir:  "/apps/nabu/%s",
	},
	{
		Id:     5,
		UserId: 1,
		Title:  "barbarov.com",
		Repository: &Repository{
			Id:    1,
			Name:  "barbarov.com",
			Owner: "abarbarov",
			Token: "dc374e4fc6a6c4912bb7599aaf4b138f0d942227",
		},
		Host: "95.216.163.61:22",
		Exec: "barbarov.%s.service",
		Dir:  "/apps/barbarov/%s",
	},
	{
		Id:     6,
		UserId: 1,
		Title:  "svoerazvitie.com",
		Repository: &Repository{
			Id:    1,
			Name:  "underconstruction",
			Owner: "abarbarov",
			Token: "dc374e4fc6a6c4912bb7599aaf4b138f0d942227",
		},
		Host: "95.216.163.61:22",
		Exec: "svoerazvitie.%s.service",
		Dir:  "/apps/svoerazvitie/%s",
	},
	{
		Id:     1,
		UserId: 2,
		Title:  "firstfile-dev",
		Repository: &Repository{
			Id:    1,
			Name:  "trademark.web",
			Owner: "abarbarov",
			Token: "dc374e4fc6a6c4912bb7599aaf4b138f0d942227",
		},
		Host: "95.216.163.61:22",
		Exec: "firstfile.%s.service",
		Dir:  "/apps/firstfile/%s",
	},
	{
		Id:     2,
		UserId: 2,
		Title:  "firstfile-PROD",
		Repository: &Repository{
			Id:    1,
			Name:  "trademark.web",
			Owner: "abarbarov",
			Token: "dc374e4fc6a6c4912bb7599aaf4b138f0d942227",
		},
		Host: "5.23.53.238:22",
		Exec: "trademark.%s.service",
		Dir:  "/apps/trademark/%s",
	},
	{
		Id:     7,
		UserId: 1,
		Title:  "tgnabu",
		Repository: &Repository{
			Id:    1,
			Name:  "nabu.tg",
			Owner: "abarbarov",
			Token: "dc374e4fc6a6c4912bb7599aaf4b138f0d942227",
		},
		Host: "95.216.163.61:22",
		Exec: "tg.nabu.%s.service",
		Dir:  "/apps/tg.nabu/%s",
	},
}

func (ds *DataStore) Projects(userId int64) ([]*Project, error) {
	var userProjects []*Project

	for _, p := range projects {
		if p.UserId == userId {
			userProjects = append(userProjects, p)
		}
	}

	return userProjects, nil
}

func (ds *DataStore) Project(userId, projectId int64) (*Project, error) {
	for _, p := range projects {
		if p.UserId == userId && p.Id == projectId {
			return p, nil
		}
	}

	return nil, nil
}
