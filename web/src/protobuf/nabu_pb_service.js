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

NabuService.Authenticate = {
  methodName: "Authenticate",
  service: NabuService,
  requestStream: false,
  responseStream: false,
  requestType: protobuf_nabu_pb.AuthRequest,
  responseType: protobuf_nabu_pb.AuthResponse
};

NabuService.Register = {
  methodName: "Register",
  service: NabuService,
  requestStream: false,
  responseStream: false,
  requestType: protobuf_nabu_pb.AuthRequest,
  responseType: protobuf_nabu_pb.AuthResponse
};

NabuService.RefreshToken = {
  methodName: "RefreshToken",
  service: NabuService,
  requestStream: false,
  responseStream: false,
  requestType: protobuf_nabu_pb.EmptyRequest,
  responseType: protobuf_nabu_pb.AuthResponse
};

NabuService.ListProjects = {
  methodName: "ListProjects",
  service: NabuService,
  requestStream: false,
  responseStream: true,
  requestType: protobuf_nabu_pb.EmptyRequest,
  responseType: protobuf_nabu_pb.ListProjectsResponse
};

NabuService.ListBranches = {
  methodName: "ListBranches",
  service: NabuService,
  requestStream: false,
  responseStream: true,
  requestType: protobuf_nabu_pb.BranchRequest,
  responseType: protobuf_nabu_pb.ListBranchesResponse
};

NabuService.ListCommits = {
  methodName: "ListCommits",
  service: NabuService,
  requestStream: false,
  responseStream: true,
  requestType: protobuf_nabu_pb.CommitsRequest,
  responseType: protobuf_nabu_pb.ListCommitsResponse
};

NabuService.Build = {
  methodName: "Build",
  service: NabuService,
  requestStream: false,
  responseStream: true,
  requestType: protobuf_nabu_pb.BuildRequest,
  responseType: protobuf_nabu_pb.MessageResponse
};

NabuService.Copy = {
  methodName: "Copy",
  service: NabuService,
  requestStream: false,
  responseStream: true,
  requestType: protobuf_nabu_pb.CopyRequest,
  responseType: protobuf_nabu_pb.MessageResponse
};

NabuService.Install = {
  methodName: "Install",
  service: NabuService,
  requestStream: false,
  responseStream: true,
  requestType: protobuf_nabu_pb.InstallRequest,
  responseType: protobuf_nabu_pb.MessageResponse
};

NabuService.Restart = {
  methodName: "Restart",
  service: NabuService,
  requestStream: false,
  responseStream: true,
  requestType: protobuf_nabu_pb.RestartRequest,
  responseType: protobuf_nabu_pb.MessageResponse
};

NabuService.Download = {
  methodName: "Download",
  service: NabuService,
  requestStream: false,
  responseStream: true,
  requestType: protobuf_nabu_pb.DownloadRequest,
  responseType: protobuf_nabu_pb.MessageResponse
};

NabuService.Upload = {
  methodName: "Upload",
  service: NabuService,
  requestStream: false,
  responseStream: true,
  requestType: protobuf_nabu_pb.UploadRequest,
  responseType: protobuf_nabu_pb.MessageResponse
};

exports.NabuService = NabuService;

function NabuServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

NabuServiceClient.prototype.authenticate = function authenticate(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  grpc.unary(NabuService.Authenticate, {
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

NabuServiceClient.prototype.register = function register(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  grpc.unary(NabuService.Register, {
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

NabuServiceClient.prototype.refreshToken = function refreshToken(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  grpc.unary(NabuService.RefreshToken, {
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

NabuServiceClient.prototype.listBranches = function listBranches(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(NabuService.ListBranches, {
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

NabuServiceClient.prototype.copy = function copy(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(NabuService.Copy, {
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

NabuServiceClient.prototype.install = function install(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(NabuService.Install, {
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

NabuServiceClient.prototype.restart = function restart(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(NabuService.Restart, {
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

NabuServiceClient.prototype.download = function download(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(NabuService.Download, {
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

NabuServiceClient.prototype.upload = function upload(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(NabuService.Upload, {
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

