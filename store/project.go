package store

type Project struct {
	Id         int64
	Title      string
	Repository *Repository
	Exec       string
	Dir        string
}

type Repository struct {
	Id    int64
	Name  string
	Owner string
	Token string
}

func (ds *DataStore) Projects() ([]*Project, error) {
	var projects []*Project

	projects = append(projects, &Project{
		Id:    1,
		Title: "firstfile-dev",
		Repository: &Repository{
			Id:    1,
			Name:  "trademark.web",
			Owner: "abarbarov",
			Token: "dc374e4fc6a6c4912bb7599aaf4b138f0d942227",
		},
		Exec: "firstfile.%s.service",
		Dir:  "/apps/firstfile/%s",
	})

	projects = append(projects, &Project{
		Id:    2,
		Title: "firstfile-prod",
		Repository: &Repository{
			Id:    1,
			Name:  "trademark.web",
			Owner: "abarbarov",
			Token: "dc374e4fc6a6c4912bb7599aaf4b138f0d942227",
		},
		Exec: "firstfile.%s.service",
		Dir:  "/apps/firstfile/%s",
	})

	projects = append(projects, &Project{
		Id:    3,
		Title: "nabu",
		Repository: &Repository{
			Id:    1,
			Name:  "nabu",
			Owner: "abarbarov",
			Token: "dc374e4fc6a6c4912bb7599aaf4b138f0d942227",
		},
		Exec: "nabu.%s.service",
		Dir:  "/apps/nabu/%s",
	})

	projects = append(projects, &Project{
		Id:    4,
		Title: "boilerplate",
		Repository: &Repository{
			Id:    1,
			Name:  "boilerplate",
			Owner: "abarbarov",
			Token: "dc374e4fc6a6c4912bb7599aaf4b138f0d942227",
		},
		Exec: "nabu.%s.service",
		Dir:  "/apps/nabu/%s",
	})

	projects = append(projects, &Project{
		Id:    5,
		Title: "barbarov.com",
		Repository: &Repository{
			Id:    1,
			Name:  "barbarov.com",
			Owner: "abarbarov",
			Token: "dc374e4fc6a6c4912bb7599aaf4b138f0d942227",
		},
		Exec: "barbarov.%s.service",
		Dir:  "/apps/barbarov/%s",
	})

	projects = append(projects, &Project{
		Id:    6,
		Title: "svoerazvitie.com",
		Repository: &Repository{
			Id:    1,
			Name:  "svoerazvitie.com",
			Owner: "abarbarov",
			Token: "dc374e4fc6a6c4912bb7599aaf4b138f0d942227",
		},
		Exec: "svoerazvitie.%s.service",
		Dir:  "/apps/svoerazvitie/%s",
	})

	return projects, nil
}

func (ds *DataStore) Project(id int64) (*Project, error) {

	allProjects, err := ds.Projects()

	if err != nil {
		return nil, err
	}

	for _, p := range allProjects {
		if p.Id == id {
			return p, nil
		}
	}

	return nil, nil
}
