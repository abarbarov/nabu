package main

import (
	"context"
	"fmt"
	"github.com/abarbarov/nabu/api"
	"github.com/abarbarov/nabu/builder"
	"github.com/abarbarov/nabu/github"
	"github.com/abarbarov/nabu/store"
	"github.com/abarbarov/nabu/tools"
	"github.com/jessevdk/go-flags"
	"log"
	"os"
	"os/signal"
	"syscall"
)

var version = "unknown"

type Opts struct {
	Port         int    `long:"port" env:"NABU_PORT" default:"9091" description:"port"`
	WebRoot      string `long:"web-root" env:"NABU_WEB_ROOT" default:"./web" description:"web root directory"`
	BuildOutput  string `long:"build-output" env:"NABU_BUILD_OUTPUT" default:"/builds/output" description:"build output root directory"`
	GoExecutable string `long:"go-executable" env:"NABU_GO_EXEC_PATH" default:"go" description:"go executable file"`
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

	err := tools.MakeDirs(opts.BuildOutput)

	if err != nil {
		log.Fatalf("[ERROR] failed to create dirs, %+v", err)
	}

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
	ds := &store.DataStore{}
	gh := &github.Github{}
	b := &builder.Builder{
		Github:       gh,
		BuildOutput:  opts.BuildOutput,
		GoExecutable: opts.GoExecutable,
	}

	srv := &api.Server{
		Version: version,
		WebRoot: opts.WebRoot,
		Store:   ds,
		Github:  gh,
		Builder: b,
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
