package api

import (
	"context"
	"fmt"
	"github.com/abarbarov/nabu/api/middleware"
	"github.com/abarbarov/nabu/auth"
	"github.com/didip/tollbooth"
	"github.com/didip/tollbooth_chi"
	"github.com/go-chi/chi"
	"log"
	"net/http"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/abarbarov/nabu/builder"
	"github.com/abarbarov/nabu/github"
	"github.com/abarbarov/nabu/store"
)

type Server struct {
	Version       string
	WebRoot       string
	Logger        log.Logger
	httpServer    *http.Server
	lock          sync.Mutex
	Store         *store.DataStore
	Github        *github.Github
	Builder       *builder.Builder
	Authenticator *auth.Authenticator
}

// Run the lister and request's router, activate server
func (s *Server) Run(port int) error {
	log.Printf("[INFO] activate server on port %d", port)

	router := s.routes()

	s.lock.Lock()
	s.httpServer = &http.Server{
		Addr:              fmt.Sprintf(":%d", port),
		Handler:           router,
		ReadHeaderTimeout: 5 * time.Minute,
		WriteTimeout:      5 * time.Minute,
		IdleTimeout:       10 * time.Minute,
	}
	s.lock.Unlock()

	err := s.httpServer.ListenAndServe()
	return err
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

	grpcMiddleware := middleware.NewGrpcWebMiddleware(s.Store, s.Github, s.Builder, s.Authenticator)

	router.Use(grpcMiddleware.Handler)

	router.Route("/", func(r chi.Router) {
		r.Use(tollbooth_chi.LimitHandler(tollbooth.NewLimiter(10, nil)))
		//r.Use(corsOpts.Handler)
		r.Get("/", s.staticFile("index.html"))
		r.Get("/projects", s.staticFile("index.html"))
		r.Get("/favicon.ico", s.staticFile("favicon.ico"))
		r.Get("/static/css/*", s.staticHandler)
		r.Get("/static/js/*", s.staticHandler)
	})

	router.Route("/api/v1", func(rapi chi.Router) {
		rapi.Group(func(ropen chi.Router) {
			ropen.Get("/ping", s.pingCtrl)
		})
	})

	return router
}
func (s *Server) staticHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, filepath.Join(s.WebRoot, r.URL.Path[1:]))
}

func (s *Server) staticFile(file string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, filepath.Join(s.WebRoot, file))
	}
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
