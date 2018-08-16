// package: protobuf
// file: protobuf/nabu.proto

import * as protobuf_nabu_pb from "../protobuf/nabu_pb";
import {grpc} from "grpc-web-client";

type HackerNewsServiceListStories = {
  readonly methodName: string;
  readonly service: typeof HackerNewsService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof protobuf_nabu_pb.ListStoriesRequest;
  readonly responseType: typeof protobuf_nabu_pb.ListStoriesResponse;
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
  listStories(requestMessage: protobuf_nabu_pb.ListStoriesRequest, metadata?: grpc.Metadata): ResponseStream<protobuf_nabu_pb.ListStoriesResponse>;
}

