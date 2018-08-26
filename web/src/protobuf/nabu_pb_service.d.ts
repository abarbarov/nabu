// package: protobuf
// file: protobuf/nabu.proto

import * as protobuf_nabu_pb from "../protobuf/nabu_pb";
import {grpc} from "grpc-web-client";

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
  readonly responseType: typeof protobuf_nabu_pb.BuildResponse;
};

export class NabuService {
  static readonly serviceName: string;
  static readonly ListProjects: NabuServiceListProjects;
  static readonly ListBranches: NabuServiceListBranches;
  static readonly ListCommits: NabuServiceListCommits;
  static readonly Build: NabuServiceBuild;
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
  listProjects(requestMessage: protobuf_nabu_pb.EmptyRequest, metadata?: grpc.Metadata): ResponseStream<protobuf_nabu_pb.ListProjectsResponse>;
  listBranches(requestMessage: protobuf_nabu_pb.BranchRequest, metadata?: grpc.Metadata): ResponseStream<protobuf_nabu_pb.ListBranchesResponse>;
  listCommits(requestMessage: protobuf_nabu_pb.CommitsRequest, metadata?: grpc.Metadata): ResponseStream<protobuf_nabu_pb.ListCommitsResponse>;
  build(requestMessage: protobuf_nabu_pb.BuildRequest, metadata?: grpc.Metadata): ResponseStream<protobuf_nabu_pb.BuildResponse>;
}

