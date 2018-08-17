// package: protobuf
// file: protobuf/nabu.proto

var protobuf_nabu_pb = require("../protobuf/nabu_pb");
var grpc = require("grpc-web-client").grpc;

var NabuService = (function () {
  function NabuService() {}
  NabuService.serviceName = "protobuf.NabuService";
  return NabuService;
}());

NabuService.ListStories = {
  methodName: "ListStories",
  service: NabuService,
  requestStream: false,
  responseStream: true,
  requestType: protobuf_nabu_pb.ListStoriesRequest,
  responseType: protobuf_nabu_pb.ListStoriesResponse
};

exports.NabuService = NabuService;

function NabuServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

NabuServiceClient.prototype.listStories = function listStories(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(NabuService.ListStories, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.end.forEach(function (handler) {
        handler();
      });
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

exports.NabuServiceClient = NabuServiceClient;

