package proxy

import (
	"bufio"
	"net/http"
)

func Article(w http.ResponseWriter, r *http.Request) {
	queryValues := r.URL.Query()
	url := queryValues.Get("q")
	if url == "" {
		http.Error(w, "Must specify the url to request", 400)
		return
	}
	response, err := http.Get(url)
	if err != nil {
		http.Error(w, "Failed to retrieve article", 500)
		return
	}
	if response.StatusCode >= 400 {
		if err != nil {
			http.Error(w, response.Status, response.StatusCode)
			return
		}
	}
	reader := bufio.NewReader(response.Body)
	reader.WriteTo(w)
}
