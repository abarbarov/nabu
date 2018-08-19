/* eslint-disable */
// package: protobuf
// file: protobuf/nabu.proto

var protobuf_nabu_pb = require("../protobuf/nabu_pb");
var grpc = require("grpc-web-client").grpc;

var NabuService = (function () {
  function NabuService() {}
  NabuService.serviceName = "protobuf.NabuService";
  return NabuService;
}());

NabuService.CreateProject = {
  methodName: "CreateProject",
  service: NabuService,
  requestStream: false,
  responseStream: false,
  requestType: protobuf_nabu_pb.CreateProjectRequest,
  responseType: protobuf_nabu_pb.ListProjectsResponse
};

NabuService.ListProjects = {
  methodName: "ListProjects",
  service: NabuService,
  requestStream: false,
  responseStream: true,
  requestType: protobuf_nabu_pb.EmptyRequest,
  responseType: protobuf_nabu_pb.ListProjectsResponse
};

NabuService.ListCommits = {
  methodName: "ListCommits",
  service: NabuService,
  requestStream: false,
  responseStream: true,
  requestType: protobuf_nabu_pb.ProjectRequest,
  responseType: protobuf_nabu_pb.ListCommitsResponse
};

NabuService.Build = {
  methodName: "Build",
  service: NabuService,
  requestStream: false,
  responseStream: true,
  requestType: protobuf_nabu_pb.BuildRequest,
  responseType: protobuf_nabu_pb.BuildResponse
};

exports.NabuService = NabuService;

function NabuServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

NabuServiceClient.prototype.createProject = function createProject(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  grpc.unary(NabuService.CreateProject, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          callback(Object.assign(new Error(response.statusMessage), { code: response.status, metadata: response.trailers }), null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
};

NabuServiceClient.prototype.listProjects = function listProjects(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(NabuService.ListProjects, {
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

NabuServiceClient.prototype.listCommits = function listCommits(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(NabuService.ListCommits, {
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

NabuServiceClient.prototype.build = function build(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(NabuService.Build, {
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

