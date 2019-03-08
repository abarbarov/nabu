package main

import (
	"context"
	"crypto/rsa"
	"fmt"
	"github.com/abarbarov/nabu/api"
	"github.com/abarbarov/nabu/auth"
	"github.com/abarbarov/nabu/builder"
	"github.com/abarbarov/nabu/github"
	"github.com/abarbarov/nabu/store"
	"github.com/abarbarov/nabu/tools"
	"github.com/dgrijalva/jwt-go"
	"github.com/jessevdk/go-flags"
	"log"
	"os"
	"os/signal"
	"path/filepath"
	"runtime"
	"syscall"
)

var revision = "unknown"
var buildstamp = "unknown"

const (
	privKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQCuvNKLs+DwyzXPAfKWoU4QrsruTnfko/sZK6Yk62mXN6MUrW+h
LlEeDr/NyyZAiET3lg6uU5AOdv6xBwXs03UXlgHFXj6BCXfwlSNbY2iXIrp8qlm8
zQXPEkd5Xx5LaZHJqVDG4GZ1Salm8RGZgDBN0LBhhkjvHkQ8uXys+hE3XwIDAQAB
AoGAcnWLcSl98h0afSPodRTqXvEwSpOp42Iqy90UsuBlxUETmSrWkX0Wc5rztukY
gHMCwi9QJI7mMSNvSCSyk+QbsSdg4MoiNYMoHNjr37hAaY4hn0RGty2ZKUCrYbVM
4NG3V9EY5IB/rjpWqgBsYiPqyTM4AxAu4mTdagxj0X1OQ9ECQQDVEDqpsw5H4gU2
b1cTtK9XcY3cEH/1pMS5X8Feta4f+tG4RDaPrP1cS5ddEcI9V+a18PqgtNoHRjqI
8Mih/SNXAkEA0fNlOcJ5XIPqhFhtmWcfaS5XBxGuNuE9t2oNGCUrGpwO2ydIKBnl
sDByG7j7LS5T5wtWXYHkCXNcjZ97dEfPOQJBAKaErJR8kKi1iQVmN1P7Xx6kbQ6V
BqzhPa7zm5l9vLzZtpahGVNpDAraOU5P1tNCo9mGoRqAvfX5eT4VkXio8rkCQF7q
+D+1wWJnLVZqGBq7eYL29Vd30dhz2pAafRMGcsdT+I9x4fhnROVz8ZLA/aW+hSY2
hPQ/bhYrtpM8n/bBJFkCQCp+bP46jnV+ryDUxBalaTgYGUroirafTanCviQLDqxo
WBSAuxo4cTgDBS6Hxrik2D7rBgGI5FLt5fKcjPvlu3w=
-----END RSA PRIVATE KEY-----`  // openssl genrsa -out app.rsa keysize

	pubKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCuvNKLs+DwyzXPAfKWoU4Qrsru
Tnfko/sZK6Yk62mXN6MUrW+hLlEeDr/NyyZAiET3lg6uU5AOdv6xBwXs03UXlgHF
Xj6BCXfwlSNbY2iXIrp8qlm8zQXPEkd5Xx5LaZHJqVDG4GZ1Salm8RGZgDBN0LBh
hkjvHkQ8uXys+hE3XwIDAQAB
-----END PUBLIC KEY-----`  // openssl rsa -in app.rsa -pubout > app.rsa.pub
)

type Opts struct {
	Port         int    `long:"port" env:"NABU_PORT" default:"9091" description:"port"`
	WebRoot      string `long:"web-root" env:"NABU_WEB_ROOT" default:"./web/build" description:"web root directory"`
	BuildOutput  string `long:"build-output" env:"NABU_BUILD_OUTPUT" default:"/builds/output" description:"build output root directory"`
	GoExecutable string `long:"go-executable" env:"NABU_GO_EXEC_PATH" default:"go" description:"go executable file"`
}

type Application struct {
	Opts
	srv        *api.Server
	terminated chan struct{}
}

func parseRsaKeys() (*rsa.PublicKey, *rsa.PrivateKey, error) {
	signKey, err := jwt.ParseRSAPrivateKeyFromPEM([]byte(privKey))
	if err != nil {
		return nil, nil, err
	}

	verifyKey, err := jwt.ParseRSAPublicKeyFromPEM([]byte(pubKey))
	if err != nil {
		return nil, nil, err
	}

	return verifyKey, signKey, nil
}

func userHomeDir() string {
	if runtime.GOOS == "windows" {
		home := os.Getenv("HOMEDRIVE") + os.Getenv("HOMEPATH")
		if home == "" {
			home = os.Getenv("USERPROFILE")
		}
		return home
	}
	return os.Getenv("HOME")
}

func main() {
	fmt.Printf("[INFO] nabu %s\nbuild date: %s\n", revision, buildstamp)

	var opts Opts
	p := flags.NewParser(&opts, flags.Default)
	if _, e := p.ParseArgs(os.Args[1:]); e != nil {
		os.Exit(1)
	}

	log.Print("[INFO] started nabu service")

	err := tools.MakeDirs(filepath.Join(userHomeDir(), opts.BuildOutput))

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
		BuildOutput:  filepath.Join(userHomeDir(), opts.BuildOutput),
		GoExecutable: opts.GoExecutable,
	}

	verifyKey, signKey, _ := parseRsaKeys()

	a := &auth.Authenticator{
		SignKey:   signKey,
		VerifyKey: verifyKey,
	}

	srv := &api.Server{
		Version:       revision,
		WebRoot:       opts.WebRoot,
		Store:         ds,
		Github:        gh,
		Builder:       b,
		Authenticator: a,
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
