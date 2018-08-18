// package: protobuf
// file: protobuf/nabu.proto

import * as protobuf_nabu_pb from "../protobuf/nabu_pb";
import {grpc} from "grpc-web-client";

type NabuServiceCreateProject = {
  readonly methodName: string;
  readonly service: typeof NabuService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof protobuf_nabu_pb.CreateProjectRequest;
  readonly responseType: typeof protobuf_nabu_pb.ListProjectsResponse;
};

type NabuServiceListProjects = {
  readonly methodName: string;
  readonly service: typeof NabuService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof protobuf_nabu_pb.EmptyRequest;
  readonly responseType: typeof protobuf_nabu_pb.ListProjectsResponse;
};

type NabuServiceListCommits = {
  readonly methodName: string;
  readonly service: typeof NabuService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof protobuf_nabu_pb.ProjectRequest;
  readonly responseType: typeof protobuf_nabu_pb.ListCommitsResponse;
};

export class NabuService {
  static readonly serviceName: string;
  static readonly CreateProject: NabuServiceCreateProject;
  static readonly ListProjects: NabuServiceListProjects;
  static readonly ListCommits: NabuServiceListCommits;
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
  createProject(
    requestMessage: protobuf_nabu_pb.CreateProjectRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError, responseMessage: protobuf_nabu_pb.ListProjectsResponse|null) => void
  ): void;
  createProject(
    requestMessage: protobuf_nabu_pb.CreateProjectRequest,
    callback: (error: ServiceError, responseMessage: protobuf_nabu_pb.ListProjectsResponse|null) => void
  ): void;
  listProjects(requestMessage: protobuf_nabu_pb.EmptyRequest, metadata?: grpc.Metadata): ResponseStream<protobuf_nabu_pb.ListProjectsResponse>;
  listCommits(requestMessage: protobuf_nabu_pb.ProjectRequest, metadata?: grpc.Metadata): ResponseStream<protobuf_nabu_pb.ListCommitsResponse>;
}

