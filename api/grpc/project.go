package grpc

import (
	"net/http"
)

func Project(w http.ResponseWriter, r *http.Request) {
	queryValues := r.URL.Query()
	id := queryValues.Get("q")
	if id == "" {
		http.Error(w, "Must specify the project id", 400)
		return
	}

	w.Write([]byte("OK"))

	//
	//response, err := http.Get("https://google.com")
	//if err != nil {
	//	http.Error(w, "Failed to retrieve article", 500)
	//	return
	//}
	//if response.StatusCode >= 400 {
	//	if err != nil {
	//		http.Error(w, response.Status, response.StatusCode)
	//		return
	//	}
	//}
	//
	//reader := bufio.NewReader(response.Body)
	//reader.WriteTo(w)
}
