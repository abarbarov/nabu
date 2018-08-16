// package: proto
// file: proto/nabu.proto

import * as proto_nabu_pb from "../proto/nabu_pb";
import {grpc} from "grpc-web-client";

type HackerNewsServiceListStories = {
  readonly methodName: string;
  readonly service: typeof HackerNewsService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof proto_nabu_pb.ListStoriesRequest;
  readonly responseType: typeof proto_nabu_pb.ListStoriesResponse;
};

export class HackerNewsService {
  static readonly serviceName: string;
  static readonly ListStories: HackerNewsServiceListStories;
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

export class HackerNewsServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: ServiceClientOptions);
  listStories(requestMessage: proto_nabu_pb.ListStoriesRequest, metadata?: grpc.Metadata): ResponseStream<proto_nabu_pb.ListStoriesResponse>;
}

