// package: protobuf
// file: protobuf/nabu.proto

import * as protobuf_nabu_pb from "../protobuf/nabu_pb";
import {grpc} from "grpc-web-client";

type NabuServiceAuthenticate = {
  readonly methodName: string;
  readonly service: typeof NabuService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof protobuf_nabu_pb.AuthRequest;
  readonly responseType: typeof protobuf_nabu_pb.AuthResponse;
};

type NabuServiceRegister = {
  readonly methodName: string;
  readonly service: typeof NabuService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof protobuf_nabu_pb.AuthRequest;
  readonly responseType: typeof protobuf_nabu_pb.AuthResponse;
};

type NabuServiceRefreshToken = {
  readonly methodName: string;
  readonly service: typeof NabuService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof protobuf_nabu_pb.EmptyRequest;
  readonly responseType: typeof protobuf_nabu_pb.AuthResponse;
};

type NabuServiceListProjects = {
  readonly methodName: string;
  readonly service: typeof NabuService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof protobuf_nabu_pb.EmptyRequest;
  readonly responseType: typeof protobuf_nabu_pb.ListProjectsResponse;
};

type NabuServiceListBranches = {
  readonly methodName: string;
  readonly service: typeof NabuService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof protobuf_nabu_pb.BranchRequest;
  readonly responseType: typeof protobuf_nabu_pb.ListBranchesResponse;
};

type NabuServiceListCommits = {
  readonly methodName: string;
  readonly service: typeof NabuService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof protobuf_nabu_pb.CommitsRequest;
  readonly responseType: typeof protobuf_nabu_pb.ListCommitsResponse;
};

type NabuServiceBuild = {
  readonly methodName: string;
  readonly service: typeof NabuService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof protobuf_nabu_pb.BuildRequest;
  readonly responseType: typeof protobuf_nabu_pb.MessageResponse;
};

type NabuServiceCopy = {
  readonly methodName: string;
  readonly service: typeof NabuService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof protobuf_nabu_pb.CopyRequest;
  readonly responseType: typeof protobuf_nabu_pb.MessageResponse;
};

type NabuServiceInstall = {
  readonly methodName: string;
  readonly service: typeof NabuService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof protobuf_nabu_pb.InstallRequest;
  readonly responseType: typeof protobuf_nabu_pb.MessageResponse;
};

type NabuServiceRestart = {
  readonly methodName: string;
  readonly service: typeof NabuService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof protobuf_nabu_pb.RestartRequest;
  readonly responseType: typeof protobuf_nabu_pb.MessageResponse;
};

export class NabuService {
  static readonly serviceName: string;
  static readonly Authenticate: NabuServiceAuthenticate;
  static readonly Register: NabuServiceRegister;
  static readonly RefreshToken: NabuServiceRefreshToken;
  static readonly ListProjects: NabuServiceListProjects;
  static readonly ListBranches: NabuServiceListBranches;
  static readonly ListCommits: NabuServiceListCommits;
  static readonly Build: NabuServiceBuild;
  static readonly Copy: NabuServiceCopy;
  static readonly Install: NabuServiceInstall;
  static readonly Restart: NabuServiceRestart;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }
export type ServiceClientOptions = { transport: grpc.TransportConstructor; debug?: boolean }

interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: () => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}

export class NabuServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: ServiceClientOptions);
  authenticate(
    requestMessage: protobuf_nabu_pb.AuthRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: protobuf_nabu_pb.AuthResponse|null) => void
  ): void;
  authenticate(
    requestMessage: protobuf_nabu_pb.AuthRequest,
    callback: (error: ServiceError, responseMessage: protobuf_nabu_pb.AuthResponse|null) => void
  ): void;
  register(
    requestMessage: protobuf_nabu_pb.AuthRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: protobuf_nabu_pb.AuthResponse|null) => void
  ): void;
  register(
    requestMessage: protobuf_nabu_pb.AuthRequest,
    callback: (error: ServiceError, responseMessage: protobuf_nabu_pb.AuthResponse|null) => void
  ): void;
  refreshToken(
    requestMessage: protobuf_nabu_pb.EmptyRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: protobuf_nabu_pb.AuthResponse|null) => void
  ): void;
  refreshToken(
    requestMessage: protobuf_nabu_pb.EmptyRequest,
    callback: (error: ServiceError, responseMessage: protobuf_nabu_pb.AuthResponse|null) => void
  ): void;
  listProjects(requestMessage: protobuf_nabu_pb.EmptyRequest, metadata?: grpc.Metadata): ResponseStream<protobuf_nabu_pb.ListProjectsResponse>;
  listBranches(requestMessage: protobuf_nabu_pb.BranchRequest, metadata?: grpc.Metadata): ResponseStream<protobuf_nabu_pb.ListBranchesResponse>;
  listCommits(requestMessage: protobuf_nabu_pb.CommitsRequest, metadata?: grpc.Metadata): ResponseStream<protobuf_nabu_pb.ListCommitsResponse>;
  build(requestMessage: protobuf_nabu_pb.BuildRequest, metadata?: grpc.Metadata): ResponseStream<protobuf_nabu_pb.MessageResponse>;
  copy(requestMessage: protobuf_nabu_pb.CopyRequest, metadata?: grpc.Metadata): ResponseStream<protobuf_nabu_pb.MessageResponse>;
  install(requestMessage: protobuf_nabu_pb.InstallRequest, metadata?: grpc.Metadata): ResponseStream<protobuf_nabu_pb.MessageResponse>;
  restart(requestMessage: protobuf_nabu_pb.RestartRequest, metadata?: grpc.Metadata): ResponseStream<protobuf_nabu_pb.MessageResponse>;
}

