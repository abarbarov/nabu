```
$ curl -L https://github.com/containous/traefik/releases/download/v1.6.6/traefik_linux-amd64 --output traefik
$ chmod +x traefik
$ curl -L https://raw.githubusercontent.com/containous/traefik/master/traefik.sample.toml --output traefik.toml
./traefik --configFile=​traefik.toml
```

95.216.163.61