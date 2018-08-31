package store

type Project struct {
	Id         int64
	Title      string
	Repository *Repository
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
			Token: "d14813a8df45fa3d136e3fd6690a49b780268978",
		},
	})

	projects = append(projects, &Project{
		Id:    2,
		Title: "firstfile-prod",
		Repository: &Repository{
			Id:    1,
			Name:  "trademark.web",
			Owner: "abarbarov",
			Token: "d14813a8df45fa3d136e3fd6690a49b780268978",
		},
	})

	projects = append(projects, &Project{
		Id:    3,
		Title: "nabu",
		Repository: &Repository{
			Id:    1,
			Name:  "nabu",
			Owner: "abarbarov",
			Token: "d14813a8df45fa3d136e3fd6690a49b780268978",
		},
	})

	projects = append(projects, &Project{
		Id:    4,
		Title: "boilerplate",
		Repository: &Repository{
			Id:    1,
			Name:  "boilerplate",
			Owner: "abarbarov",
			Token: "d14813a8df45fa3d136e3fd6690a49b780268978",
		},
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
