/* eslint-disable */
// package: protobuf
// file: protobuf/nabu.proto

var protobuf_nabu_pb = require("../protobuf/nabu_pb");
var grpc = require("grpc-web-client").grpc;

var HackerNewsService = (function () {
  function HackerNewsService() {}
  HackerNewsService.serviceName = "protobuf.HackerNewsService";
  return HackerNewsService;
}());

HackerNewsService.ListStories = {
  methodName: "ListStories",
  service: HackerNewsService,
  requestStream: false,
  responseStream: true,
  requestType: protobuf_nabu_pb.ListStoriesRequest,
  responseType: protobuf_nabu_pb.ListStoriesResponse
};

exports.HackerNewsService = HackerNewsService;

function HackerNewsServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

HackerNewsServiceClient.prototype.listStories = function listStories(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(HackerNewsService.ListStories, {
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

exports.HackerNewsServiceClient = HackerNewsServiceClient;

