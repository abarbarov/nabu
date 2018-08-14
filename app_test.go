package main

import (
	"testing"
	"time"
	"net/http"
	"io/ioutil"
	"github.com/jessevdk/go-flags"
	"log"
	"context"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestApplication(t *testing.T) {
	app, ctx := prepApp(t, 500*time.Millisecond, func(o Opts) Opts {
		o.Port = 18080
		return o
	})

	go func() { _ = app.Run(ctx) }()
	time.Sleep(100 * time.Millisecond) // let server start

	// send ping
	resp, err := http.Get("http://localhost:18080/api/v1/ping")
	require.Nil(t, err)
	defer resp.Body.Close()
	assert.Equal(t, 200, resp.StatusCode)
	body, err := ioutil.ReadAll(resp.Body)
	assert.Nil(t, err)
	assert.Equal(t, "pong", string(body))

	app.Wait()
}

func prepApp(t *testing.T, duration time.Duration, fn func(o Opts) Opts) (*Application, context.Context) {
	opts := Opts{}
	// prepare options
	p := flags.NewParser(&opts, flags.Default)
	_, err := p.ParseArgs([]string{"--url=https://dev.nabu.app"})
	require.Nil(t, err)
	opts = fn(opts)

	// create app
	app, err := Create(opts)
	require.Nil(t, err)

	ctx, cancel := context.WithCancel(context.Background())
	go func() {
		time.Sleep(duration)
		log.Print("[TEST] terminate app")
		cancel()
	}()
	return app, ctx
}
