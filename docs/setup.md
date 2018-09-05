###1. Create new server on hetzner.com with cloud-init script
```
#cloud-config

package-update: true
package_upgrade: true

packages:
- zip
- unzip

users:
  - name: dev
    ssh-authorized-keys:
      - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDF7P8v4TGaYT1o0Xs0k/9GvhI6lQQIAOQ/J06rTITz9XcuPVAbgItVzJkVqrW/fqUPwF5bckxltiiPTLDYLavzVguTjVOw1LTLI/X+RVEIV6I6k2/s/lNldikR1cTVsmSyTvFb4YBYY4/TVK84+74pR9VFV21Wjs7jfYt/zEIPcVcX0OXk5hN/TGWimjjldvMBnN3C/hhnDx3VcMonGDRVJ4lHx2Kh9iYvJedCiz89TWhWuA/9g0S5332Htfr099q7/ST3k67peNO6kmISR6fn/TdI1JHZ3WII7eRP806u/W2S7uEMDySLhtGAdvrlUmj73RJSA8aNrxRmYceE9QqyrG5Nk/i7aqEyiVNYzR5kqm8MZFHLrhA3VUmpCQD3zsi73xDoSkxjEoiTLanoohPuxf1E9pSc/lvP30JOI9pJvP+arSaeX1VhM/SVHTX9Le5ZOXXAXae2gF1cESlJrzXomPIuRRHKu1gZPOjz2iYYznMU6Pk4CsKdVOWTxIeXhIcEuWcs6kPshA1x88J9aaSICv+Wwt76z0qgImpg3jyomNWQenTvXnu/ezQYMNgeodN5830m8Zs9hmP6EiBzheyGYJw/3YsBALP94SVRfRy2NU5058p8wfZatCd2HLcnlODcgWXTBMjL8GqLgeSxZMfZIgeptU8HBfbe7piuYdGmsw== afanasy.barbarov@me.com
      - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDWWufJygqU6xa/u8gDjnL0vVBWG6bwCym4RV0LG2Fa4cltCHOJqtCBGJNP6HC6AxQBE3wqMNc/5h6ywHwYpXnsNSbNUY69gMNEN30yoRMud9Yi5RKUGAYHKeO/LB3gkEPItDIvF33CP9pyyt+xjBTqROq8Ya/Y5gsAjB1la6TPQHS158OOvG1S35Dz7kHIop+JE8IR6OFga6GR+xMvawd5qyvh78vfVI7MLxZTFdLrGU1D8PWOPM6UsSiuPrt7ouk5Rug9XEeRvPV74BA1cT4q2yX07ye++7oTqfni7zkMIvl6IqDGFzkfOd6Jf21ZUAe0skRFtwG1qYWaStKYSsRv abarbarov@abarbarov-work
    groups: sudo
    shell: /bin/bash
    sudo: ['ALL=(ALL) NOPASSWD:ALL']

runcmd:
# SSH
  - sed -i -e '/^Port/s/^.*$/Port 22/' /etc/ssh/sshd_config
  - sed -i -e '/^PermitRootLogin/s/^.*$/PermitRootLogin no/' /etc/ssh/sshd_config
  - sed -i -e '/^PasswordAuthentication/s/^.*$/PasswordAuthentication no/' /etc/ssh/sshd_config
  - sed -i -e '$aAllowUsers dev' /etc/ssh/sshd_config
  - sudo systemctl restart ssh

# Firewall - defaults
  - sudo ufw default deny incoming
  - sudo ufw default allow outgoing
# Firewall - exceptions
  - sudo ufw allow ssh
  - sudo ufw allow http
  - sudo ufw allow https

# Firewall - start on boot
  - sed -i -e '/^ENABLED/s/^.*$/ENABLED=yes/' /etc/ufw/ufw.conf
  - sudo ufw enable

# Cloud-init logs
output:
  init:
    output: "> /var/log/cloud-init.out"
    error: "> /var/log/cloud-init.err"
  config: "tee -a /var/log/cloud-config.log"
  final:
    - ">> /var/log/cloud-final.out"
    - "/var/log/cloud-final.err"
```

###2. Download traefik:
```
curl -L https://github.com/containous/traefik/releases/download/v1.6.6/traefik_linux-amd64 --output traefik
chmod +x traefik
```
###3. Create traefik.toml config:
```
debug = false

logLevel = "ERROR"
defaultEntryPoints = ["https","http"]

[entryPoints]

  [entryPoints.http]
  address = ":80"
    [entryPoints.http.redirect]
    entryPoint = "https"

  [entryPoints.https]
  address = ":443"
  [entryPoints.https.tls]

[file]
  filename = "/etc/traefik-rules.toml"
  watch = true

[acme]
email = "afanasy.barbarov@hotmail.com"
storage = "acme.json"
entryPoint = "https"
onHostRule = true
acmeLogging=true

  [acme.httpChallenge]
    entryPoint = "http"

#  [acme.dnsChallenge]
#    provider = "namecheap"
#    delayBeforeCheck = 0

  [[acme.domains]]
    main = "nabu.app"
    sans = ["nabu.app", "live.nabu.app"]

  [[acme.domains]]
    main = "barbarov.com"
```
###4. Create traefik-rules.toml config
```
[backends]

  [backends.backend-nabu]
    [backends.backend-nabu.servers]
      [backends.backend-nabu.servers.server-blue]
        url = "http://127.0.0.1:10001"
        weight = 1
      [backends.backend-nabu.servers.server-green]
        url = "http://127.0.0.1:10002"
        weight = 2
    [backends.backend-nabu.maxconn]
       amount = 10
       extractorfunc = "client.ip"
    [backends.backend-nabu.loadbalancer.stickiness]

  [backends.backend-barbarov]
    [backends.backend-barbarov.servers]
      [backends.backend-barbarov.servers.server-blue]
        url = "http://127.0.0.1:10101"
        weight = 1
      [backends.backend-barbarov.servers.server-green]
        url = "http://127.0.0.1:10102"
        weight = 2
    [backends.backend-barbarov.maxconn]
       amount = 10
       extractorfunc = "client.ip"
    [backends.backend-barbarov.loadbalancer.stickiness]

[frontends]

  [frontends.frontend-nabu]
    backend = "backend-nabu"
    passHostHeader = true
    [frontends.frontend-nabu.routes]
      [frontends.frontend-nabu.routes.route0]
        rule = "Host:nabu.app,live.nabu.app"

  [frontends.frontend-barbarov]
    backend = "backend-barbarov"
    passHostHeader = true
    [frontends.frontend-barbarov.routes]
      [frontends.frontend-barbarov.routes.route0]
        rule = "Host:barbarov.com"

```
###5. create systemd traefik service at /lib/systemd/system/traefik.service
1. copy traefik to /usr/bin/traefik
2. copy traefik.toml and traefik-rules.toml to /etc
```
[Unit]
Description=Traefik

[Service]
Type=notify
ExecStart=/usr/bin/traefik --configFile=/etc/traefik.toml
Restart=always
WatchdogSec=1s

[Install]
WantedBy=multi-user.target
```
###6. Install traefik service
``
[Unit]
Description=Traefik

[Service]
Type=notify
ExecStart=/usr/bin/traefik --configFile=/etc/traefik.toml
Restart=always
WatchdogSec=1s

[Install]
WantedBy=multi-user.target
``
###7. Create apps
1. make foldera /apps/nabu and /apps/barbarov
2. create service /lib/systemd/system/barbarov.{blue, green}.service
3. create service /lib/systemd/system/nabu.{blue, green}.service
```
[Unit]
Description=barbarov blue service
ConditionPathExists=/apps/barbarov/blue
After=network.target

[Service]
Type=simple
User=root
Group=root
LimitNOFILE=1024
Restart=on-failure
RestartSec=10
StartLimitInterval=60
WorkingDirectory=/apps/barbarov/blue
ExecStart=/apps/barbarov/blue/app -port=:10101

# make sure log directory exists and owned by syslog
PermissionsStartOnly=true
ExecStartPre=/bin/mkdir -p /var/log/barbarovblue
ExecStartPre=/bin/chown syslog:adm /var/log/barbarovblue
ExecStartPre=/bin/chmod 755 /var/log/barbarovblue
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=barbarovblue

[Install]
WantedBy=multi-user.target
```

```
[Unit]
Description=barbarov green service
ConditionPathExists=/apps/barbarov/green
After=network.target

[Service]
Type=simple
User=root
Group=root
LimitNOFILE=1024
Restart=on-failure
RestartSec=10
StartLimitInterval=60
WorkingDirectory=/apps/barbarov/green
ExecStart=/apps/barbarov/green/app -port=:10102

# make sure log directory exists and owned by syslog
PermissionsStartOnly=true
ExecStartPre=/bin/mkdir -p /var/log/barbarovgreen
ExecStartPre=/bin/chown syslog:adm /var/log/barbarovgreen
ExecStartPre=/bin/chmod 755 /var/log/barbarovgreen
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=barbarovgreen

[Install]
WantedBy=multi-user.target
```

```
[Unit]
Description=nabu blue service
ConditionPathExists=/apps/nabu/blue
After=network.target

[Service]
Type=simple
User=root
Group=root
LimitNOFILE=1024
Restart=on-failure
RestartSec=10
StartLimitInterval=60
WorkingDirectory=/apps/nabu/blue
ExecStart=/apps/nabu/blue/app -port=:10001

# make sure log directory exists and owned by syslog
PermissionsStartOnly=true
ExecStartPre=/bin/mkdir -p /var/log/nabublue
ExecStartPre=/bin/chown syslog:adm /var/log/nabublue
ExecStartPre=/bin/chmod 755 /var/log/nabublue
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=nabublue

[Install]
WantedBy=multi-user.target
```


```
[Unit]
Description=nabu green service
ConditionPathExists=/apps/nabu/green
After=network.target

[Service]
Type=simple
User=root
Group=root
LimitNOFILE=1024
Restart=on-failure
RestartSec=10
StartLimitInterval=60
WorkingDirectory=/apps/nabu/green
ExecStart=/apps/nabu/green/app -port=:10002

# make sure log directory exists and owned by syslog
PermissionsStartOnly=true
ExecStartPre=/bin/mkdir -p /var/log/nabugreen
ExecStartPre=/bin/chown syslog:adm /var/log/nabugreen
ExecStartPre=/bin/chmod 755 /var/log/nabugreen
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=nabugreen

[Install]
WantedBy=multi-user.target
```

#### enable services
```
sudo systemctl enable barbarov.blue.service
sudo systemctl enable barbarov.green.service
sudo systemctl enable nabu.blue.service
sudo systemctl enable nabu.green.service
```
95.216.163.61

NAMECHEAP_API_USER
NAMECHEAP_API_KEY