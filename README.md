update proto models:

Windows:
```
protoc --proto_path=./api/proto/v1 --go_out=plugins=grpc:./api/proto/v1 --plugin=protoc-gen-ts=C:/goprojects/abarbarov/nabu/web/node_modules/.bin/protoc-gen-ts.cmd --ts_out=service=true:./web/src/proto/v1 --js_out=import_style=commonjs,binary:./web/src/proto/v1 nabu.proto
```
Linux/Mac:
```
protoc --proto_path=./api/proto/v1 --go_out=plugins=grpc:./api/proto/v1 --plugin=protoc-gen-ts=./web/node_modules/.bin/protoc-gen-ts --ts_out=service=true:./web/src/proto/v1 --js_out=import_style=commonjs,binary:./web/src/proto/v1 nabu.proto
```


add /* eslint-disable */ to generated *.js files