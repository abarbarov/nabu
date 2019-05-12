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
		Title:  "First to File (DEV)",
		Repository: &Repository{
			Id:    1,
			Name:  "web",
			Owner: "firsttofile",
			Token: "f87a24802641914a892b85e67add8f6b828bb6e7",
		},
		Host: "95.216.163.61:22",
		Exec: "firstfile.%s.service",
		Dir:  "/apps/firstfile/%s",
	},
	{
		Id:     2,
		UserId: 1,
		Title:  "First to File (PROD)",
		Repository: &Repository{
			Id:    1,
			Name:  "web",
			Owner: "firsttofile",
			Token: "f87a24802641914a892b85e67add8f6b828bb6e7",
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
			Name:  "svoerazvitie.com",
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
		Title:  "First to File (DEV)",
		Repository: &Repository{
			Id:    1,
			Name:  "web",
			Owner: "firsttofile",
			Token: "f87a24802641914a892b85e67add8f6b828bb6e7",
		},
		Host: "95.216.163.61:22",
		Exec: "firstfile.%s.service",
		Dir:  "/apps/firstfile/%s",
	},
	{
		Id:     2,
		UserId: 2,
		Title:  "First to File (PROD)",
		Repository: &Repository{
			Id:    1,
			Name:  "firstfile.web",
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
		Title:  "nabu.tg",
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
	{
		Id:     8,
		UserId: 1,
		Title:  "deliv",
		Repository: &Repository{
			Id:    1,
			Name:  "deliv",
			Owner: "abarbarov",
			Token: "dc374e4fc6a6c4912bb7599aaf4b138f0d942227",
		},
		Host: "95.216.163.61:22",
		Exec: "deliv.%s.service",
		Dir:  "/apps/deliv/%s",
	},
	{
		Id:     3,
		UserId: 2,
		Title:  "First to File's MKTU service (PROD)",
		Repository: &Repository{
			Id:    1,
			Name:  "mktu",
			Owner: "firsttofile",
			Token: "f87a24802641914a892b85e67add8f6b828bb6e7",
		},
		Host: "95.216.163.61:22",
		Exec: "firstfilemktu.%s.service",
		Dir:  "/apps/firstfilemktu/%s",
	},
	{
		Id:     9,
		UserId: 1,
		Title:  "First to File's MKTU service (PROD)",
		Repository: &Repository{
			Id:    1,
			Name:  "mktu",
			Owner: "firsttofile",
			Token: "f87a24802641914a892b85e67add8f6b828bb6e7",
		},
		Host: "95.216.163.61:22",
		Exec: "firstfilemktu.%s.service",
		Dir:  "/apps/firstfilemktu/%s",
	},
	{
		Id:     10,
		UserId: 1,
		Title:  "Iriski releases",
		Repository: &Repository{
			Id:    1,
			Name:  "iriski.releases",
			Owner: "abarbarov",
			Token: "dc374e4fc6a6c4912bb7599aaf4b138f0d942227",
		},
		Host: "116.203.144.74:22",
		Exec: "iriski.%s.service",
		Dir:  "/apps/iriski/%s",
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
