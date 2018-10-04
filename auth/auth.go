package auth

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha1"
	"crypto/x509"
	"fmt"
	"github.com/abarbarov/nabu/store"
	"github.com/dgrijalva/jwt-go"
	"github.com/pkg/errors"
	"log"
)

type Authenticator struct {
	SignKey   *rsa.PrivateKey
	VerifyKey *rsa.PublicKey
}

// CustomClaims stores user info for auth and state & from from login
type CustomClaims struct {
	jwt.StandardClaims
	User  *store.User `json:"user,omitempty"`
	State string      `json:"state,omitempty"`
}

func (a *Authenticator) Token(claims *CustomClaims) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signKeyBytes := x509.MarshalPKCS1PrivateKey(a.SignKey)

	tokenString, err := token.SignedString(signKeyBytes)
	if err != nil {
		return "", errors.Wrap(err, "can't sign jwt token")
	}

	return tokenString, nil
}

// Parse token string and verify. Not checking for expiration
func (a *Authenticator) Parse(tokenString string) (*CustomClaims, error) {
	parser := jwt.Parser{SkipClaimsValidation: true} // allow parsing of expired tokens

	token, err := parser.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		verifyKeyBytes := x509.MarshalPKCS1PublicKey(a.VerifyKey)
		return verifyKeyBytes, nil
	})
	if err != nil {
		return nil, errors.Wrap(err, "can't parse jwt")
	}

	claims, ok := token.Claims.(*CustomClaims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid jwt")
	}

	return claims, nil
}

func RandToken() string {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		log.Fatalf("[ERROR] can't get randoms, %s", err)
	}
	s := sha1.New()
	if _, err := s.Write(b); err != nil {
		log.Printf("[WARN] can't write randoms, %s", err)
	}
	return fmt.Sprintf("%x", s.Sum(nil))
}
