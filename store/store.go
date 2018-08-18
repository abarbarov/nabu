package store

type DataStore struct {
}

type Project struct {
	Id    int64
	Title string
}

func (s *DataStore) Projects() ([]*Project, error) {
	var projects []*Project

	projects = append(projects, &Project{
		Id:    1,
		Title: "firstfile-dev",
	})

	projects = append(projects, &Project{
		Id:    2,
		Title: "firstfile-prod",
	})

	projects = append(projects, &Project{
		Id:    3,
		Title: "nabu",
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
