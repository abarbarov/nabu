// package: v1
// file: nabu.proto

import * as nabu_pb from "./nabu_pb";
import {grpc} from "grpc-web-client";

type NabuServiceAuthenticate = {
  readonly methodName: string;
  readonly service: typeof NabuService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof nabu_pb.AuthRequest;
  readonly responseType: typeof nabu_pb.AuthResponse;
};

type NabuServiceRegister = {
  readonly methodName: string;
  readonly service: typeof NabuService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof nabu_pb.AuthRequest;
  readonly responseType: typeof nabu_pb.AuthResponse;
};

type NabuServiceRefreshToken = {
  readonly methodName: string;
  readonly service: typeof NabuService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof nabu_pb.EmptyRequest;
  readonly responseType: typeof nabu_pb.AuthResponse;
};

type NabuServiceListProjects = {
  readonly methodName: string;
  readonly service: typeof NabuService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof nabu_pb.EmptyRequest;
  readonly responseType: typeof nabu_pb.ListProjectsResponse;
};

type NabuServiceListBranches = {
  readonly methodName: string;
  readonly service: typeof NabuService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof nabu_pb.BranchRequest;
  readonly responseType: typeof nabu_pb.ListBranchesResponse;
};

type NabuServiceListCommits = {
  readonly methodName: string;
  readonly service: typeof NabuService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof nabu_pb.CommitsRequest;
  readonly responseType: typeof nabu_pb.ListCommitsResponse;
};

type NabuServiceBuild = {
  readonly methodName: string;
  readonly service: typeof NabuService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof nabu_pb.BuildRequest;
  readonly responseType: typeof nabu_pb.MessageResponse;
};

type NabuServiceCopy = {
  readonly methodName: string;
  readonly service: typeof NabuService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof nabu_pb.CopyRequest;
  readonly responseType: typeof nabu_pb.MessageResponse;
};

type NabuServiceInstall = {
  readonly methodName: string;
  readonly service: typeof NabuService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof nabu_pb.InstallRequest;
  readonly responseType: typeof nabu_pb.MessageResponse;
};

type NabuServiceRestart = {
  readonly methodName: string;
  readonly service: typeof NabuService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof nabu_pb.RestartRequest;
  readonly responseType: typeof nabu_pb.MessageResponse;
};

type NabuServiceDownload = {
  readonly methodName: string;
  readonly service: typeof NabuService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof nabu_pb.DownloadRequest;
  readonly responseType: typeof nabu_pb.MessageResponse;
};

type NabuServiceUpload = {
  readonly methodName: string;
  readonly service: typeof NabuService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof nabu_pb.UploadRequest;
  readonly responseType: typeof nabu_pb.MessageResponse;
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
  static readonly Download: NabuServiceDownload;
  static readonly Upload: NabuServiceUpload;
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
    requestMessage: nabu_pb.AuthRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: nabu_pb.AuthResponse|null) => void
  ): void;
  authenticate(
    requestMessage: nabu_pb.AuthRequest,
    callback: (error: ServiceError, responseMessage: nabu_pb.AuthResponse|null) => void
  ): void;
  register(
    requestMessage: nabu_pb.AuthRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: nabu_pb.AuthResponse|null) => void
  ): void;
  register(
    requestMessage: nabu_pb.AuthRequest,
    callback: (error: ServiceError, responseMessage: nabu_pb.AuthResponse|null) => void
  ): void;
  refreshToken(
    requestMessage: nabu_pb.EmptyRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: nabu_pb.AuthResponse|null) => void
  ): void;
  refreshToken(
    requestMessage: nabu_pb.EmptyRequest,
    callback: (error: ServiceError, responseMessage: nabu_pb.AuthResponse|null) => void
  ): void;
  listProjects(requestMessage: nabu_pb.EmptyRequest, metadata?: grpc.Metadata): ResponseStream<nabu_pb.ListProjectsResponse>;
  listBranches(requestMessage: nabu_pb.BranchRequest, metadata?: grpc.Metadata): ResponseStream<nabu_pb.ListBranchesResponse>;
  listCommits(requestMessage: nabu_pb.CommitsRequest, metadata?: grpc.Metadata): ResponseStream<nabu_pb.ListCommitsResponse>;
  build(requestMessage: nabu_pb.BuildRequest, metadata?: grpc.Metadata): ResponseStream<nabu_pb.MessageResponse>;
  copy(requestMessage: nabu_pb.CopyRequest, metadata?: grpc.Metadata): ResponseStream<nabu_pb.MessageResponse>;
  install(requestMessage: nabu_pb.InstallRequest, metadata?: grpc.Metadata): ResponseStream<nabu_pb.MessageResponse>;
  restart(requestMessage: nabu_pb.RestartRequest, metadata?: grpc.Metadata): ResponseStream<nabu_pb.MessageResponse>;
  download(requestMessage: nabu_pb.DownloadRequest, metadata?: grpc.Metadata): ResponseStream<nabu_pb.MessageResponse>;
  upload(requestMessage: nabu_pb.UploadRequest, metadata?: grpc.Metadata): ResponseStream<nabu_pb.MessageResponse>;
}

