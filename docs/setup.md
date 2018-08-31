1. create new server on hetzner with cloud-init script

```
curl -L https://github.com/containous/traefik/releases/download/v1.6.6/traefik_linux-amd64 --output traefik
chmod +x traefik
curl -L https://raw.githubusercontent.com/containous/traefik/master/traefik.sample.toml --output traefik.toml
./traefik --configFile=​traefik.toml
```

2. create systemd traefik service.

95.216.163.61

NAMECHEAP_API_USER
NAMECHEAP_API_KEY