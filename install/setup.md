####1. Create new server on hetzner.com with cloud-init script (see corresponding file)
####2. Download traefik:
```
curl -L https://github.com/containous/traefik/releases/download/v1.6.6/traefik_linux-amd64 --output traefik
chmod +x traefik
```
####3. Create traefik.toml config (see corresponding file)
####4. Create traefik-rules.toml config
####5. create systemd traefik.service at /lib/systemd/system/traefik.service (check corresponding file)
1. copy traefik to /usr/bin/traefik
2. copy traefik.toml and traefik-rules.toml to /etc
###6. Install traefik service
####7. Create app 
(e.g. for nabu)
```
1. make folder /apps/nabu, apps/nabu/{blue,green,data}
2. create service /lib/systemd/system/nabu.{blue, green}.service
```
####8 enable services
```
sudo systemctl enable nabu.blue.service
sudo systemctl enable nabu.green.service

sudo systemctl start nabu.blue.service
sudo systemctl start nabu.green.service
```

95.216.163.61

NAMECHEAP_API_USER
NAMECHEAP_API_KEY