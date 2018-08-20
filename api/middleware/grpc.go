package middleware

import (
	nabuGrpc "github.com/abarbarov/nabu/api/grpc"
	"github.com/abarbarov/nabu/builder"
	"github.com/abarbarov/nabu/github"
	pb "github.com/abarbarov/nabu/protobuf"
	"github.com/abarbarov/nabu/store"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"google.golang.org/grpc"
	"google.golang.org/grpc/keepalive"
	"net/http"
	"time"
)

type GrpcWebMiddleware struct {
	*grpcweb.WrappedGrpcServer
}

func (m *GrpcWebMiddleware) Handler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if m.IsAcceptableGrpcCorsRequest(r) || m.IsGrpcWebRequest(r) {
			m.ServeHTTP(w, r)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func NewGrpcWebMiddleware(store *store.DataStore, gh *github.Github, b *builder.Builder) *GrpcWebMiddleware {
	svrKeepAlive := &keepalive.ServerParameters{Timeout: 60 * time.Second}

	sopts := []grpc.ServerOption{grpc.KeepaliveParams(*svrKeepAlive)}

	grpcServer := grpc.NewServer(sopts...)
	nabuGrpcService := nabuGrpc.NewNabuGrpcService(store, gh, b)
	pb.RegisterNabuServiceServer(grpcServer, nabuGrpcService)
	wrappedGrpc := grpcweb.WrapServer(grpcServer)

	return &GrpcWebMiddleware{wrappedGrpc}
}
