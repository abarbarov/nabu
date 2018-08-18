package store

type Project struct {
	Id         int64
	Title      string
	Repository *Repository
}

func (s *DataStore) Projects() ([]*Project, error) {
	var projects []*Project

	projects = append(projects, &Project{
		Id:    1,
		Title: "firstfile-dev",
		Repository: &Repository{
			Id:    1,
			Title: "trademark.web",
			Owner: "abarbarov",
		},
	})

	projects = append(projects, &Project{
		Id:    2,
		Title: "firstfile-prod",
		Repository: &Repository{
			Id:    1,
			Title: "trademark.web",
			Owner: "abarbarov",
		},
	})

	projects = append(projects, &Project{
		Id:    3,
		Title: "nabu",
		Repository: &Repository{
			Id:    1,
			Title: "nabu",
			Owner: "abarbarov",
		},
	})

	return projects, nil
}

func (s *DataStore) Project(id int64) (*Project, error) {

	allProjects, err := s.Projects()

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
