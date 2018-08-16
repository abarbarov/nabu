update proto models:

Windows:
```
protoc --go_out=plugins=grpc:./ --plugin=protoc-gen-ts=C:/projects/src/github.com/abarbarov/nabu/web/node_modules/.bin/protoc-gen-ts.cmd --ts_out=service=true:./web/src --js_out=import_style=commonjs,binary:./web/src ./proto/nabu.proto
```
Linux/Mac:
```
protoc --go_out=plugins=grpc:./ --plugin=protoc-gen-ts=./web/node_modules/.bin/protoc-gen-ts --ts_out=service=true:./web/src --js_out=import_style=commonjs,binary:./web/src ./proto/nabu.proto
```

