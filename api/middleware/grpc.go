package middleware

import (
	nabuGrpc "github.com/abarbarov/nabu/api/grpc"
	pb "github.com/abarbarov/nabu/protobuf"
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

func NewGrpcWebMiddleware(store *store.DataStore) *GrpcWebMiddleware {

	grpcServer := grpc.NewServer()
	hackernewsService := nabuGrpc.NewNabuGrpcService(store)
	pb.RegisterNabuServiceServer(grpcServer, hackernewsService)
	wrappedGrpc := grpcweb.WrapServer(grpcServer)

	return &GrpcWebMiddleware{wrappedGrpc}
}
