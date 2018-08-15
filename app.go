package main

import (
	"log"
	"github.com/abarbarov/nabu/api"
	"github.com/jessevdk/go-flags"
	"fmt"
	"os"
	"os/signal"
	"context"
	"syscall"
)

var version = "unknown"

type Opts struct {
	Port    int    `long:"port" env:"NABU_PORT" default:"9091" description:"port"`
	WebRoot string `long:"web-root" env:"NABU_WEB_ROOT" default:"./web" description:"web root directory"`
	NabuURL string `long:"url" env:"NABU_URL" default:"dev.nabu.app" required:"true" description:"url to nabu"`
}

type Application struct {
	Opts
	srv        *api.Server
	terminated chan struct{}
}

func main() {
	fmt.Printf("[INFO] nabu %s\n", version)

	var opts Opts
	p := flags.NewParser(&opts, flags.Default)
	if _, e := p.ParseArgs(os.Args[1:]); e != nil {
		os.Exit(1)
	}

	log.Print("[INFO] started nabu service")

	ctx, cancel := context.WithCancel(context.Background())
	go func() { // catch signal and invoke graceful termination
		stop := make(chan os.Signal, 1)
		signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
		<-stop
		log.Print("[WARN] interrupt signal")
		cancel()
	}()

	app, err := Create(opts)
	if err != nil {
		log.Fatalf("[ERROR] failed to setup application, %+v", err)
	}
	err = app.Run(ctx)
	log.Printf("[INFO] nabu terminated %v", err)
}

func Create(opts Opts) (*Application, error) {
	srv := &api.Server{
		Version: version,
		WebRoot: opts.WebRoot,
	}

	tch := make(chan struct{})
	return &Application{
		srv:        srv,
		Opts:       opts,
		terminated: tch}, nil
}

// Run all application objects
func (a *Application) Run(ctx context.Context) error {
	go func() {
		// shutdown on context cancellation
		<-ctx.Done()
		a.srv.Shutdown()
	}()

	err := a.srv.Run(a.Port)

	close(a.terminated)

	return err
}

// Wait for application completion (termination)
func (a *Application) Wait() {
	<-a.terminated
	log.Printf("[TEST] thats all folks")
}
