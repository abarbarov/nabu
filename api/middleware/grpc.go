package middleware

import (
	nabuGrpc "github.com/abarbarov/nabu/api/grpc"
	pb "github.com/abarbarov/nabu/api/proto/v1"
	"github.com/abarbarov/nabu/auth"
	"github.com/abarbarov/nabu/builder"
	"github.com/abarbarov/nabu/github"
	"github.com/abarbarov/nabu/store"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"google.golang.org/grpc"
	"net/http"
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

func NewGrpcWebMiddleware(store *store.DataStore, gh *github.Github, b *builder.Builder, a *auth.Authenticator) *GrpcWebMiddleware {
	s := grpc.NewServer()
	nabuGrpcService := nabuGrpc.NewNabuGrpcService(store, gh, b, a)
	pb.RegisterNabuServiceServer(s, nabuGrpcService)
	wrappedGrpc := grpcweb.WrapServer(s)

	return &GrpcWebMiddleware{wrappedGrpc}
}
