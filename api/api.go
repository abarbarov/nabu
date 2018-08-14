package api

import (
	"net/http"
	"sync"
	"log"
	"fmt"
	"time"
	"context"

	"github.com/go-chi/chi"
	"strings"
)

type Server struct {
	Version    string
	WebRoot    string
	Logger     log.Logger
	httpServer *http.Server
	lock       sync.Mutex
}

// Run the lister and request's router, activate server
func (s *Server) Run(port int) {
	log.Printf("[INFO] activate server on port %d", port)

	router := s.routes()

	s.lock.Lock()
	s.httpServer = &http.Server{
		Addr:              fmt.Sprintf(":%d", port),
		Handler:           router,
		ReadHeaderTimeout: 5 * time.Second,
		WriteTimeout:      5 * time.Second,
		IdleTimeout:       30 * time.Second,
	}
	s.lock.Unlock()

	err := s.httpServer.ListenAndServe()
	if err != nil {
		log.Fatalf("%v", err)
	}

	log.Printf("[WARN] http server terminated, %s", err)
}

// Shutdown rest http server
func (s *Server) Shutdown() {
	log.Print("[WARN] shutdown server")
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	s.lock.Lock()
	if s.httpServer != nil {
		if err := s.httpServer.Shutdown(ctx); err != nil {
			log.Printf("[DEBUG] server shutdown error, %s", err)
		}
	}
	log.Print("[DEBUG] shutdown server completed")
	s.lock.Unlock()
}

func (s *Server) routes() chi.Router {

	router := chi.NewRouter()
	router.Route("/api/v1", func(rapi chi.Router) {
		rapi.Group(func(ropen chi.Router) {
			ropen.Get("/ping", s.pingCtrl)
		})
	})

	//file server for static content from /web
	addFileServer(router, "/web", http.Dir(s.WebRoot))

	return router
}

func (s *Server) pingCtrl(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" && strings.HasSuffix(strings.ToLower(r.URL.Path), "/ping") {
		w.Header().Set("Content-Type", "text/plain")
		w.WriteHeader(http.StatusOK)
		if _, err := w.Write([]byte("pong")); err != nil {
			log.Printf("[WARN] can't send pong, %s", err)
			return
		}
	}
}

// serves static files from /web
func addFileServer(r chi.Router, path string, root http.FileSystem) {
	log.Printf("[INFO] run file server for %s, path %s", root, path)
	if path != "/" && path[len(path)-1] != '/' {
		r.Get(path, http.RedirectHandler(path+"/", 301).ServeHTTP)
		path += "/"
	}

	path += "*"
}
