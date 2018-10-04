// package: protobuf
// file: protobuf/nabu.proto

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

export class User extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getToken(): string;
  setToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): User.AsObject;
  static toObject(includeInstance: boolean, msg: User): User.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: User, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): User;
  static deserializeBinaryFromReader(message: User, reader: jspb.BinaryReader): User;
}

export namespace User {
  export type AsObject = {
    id: number,
    token: string,
  }
}

export class Project extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getTitle(): string;
  setTitle(value: string): void;

  getRepository(): string;
  setRepository(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Project.AsObject;
  static toObject(includeInstance: boolean, msg: Project): Project.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Project, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Project;
  static deserializeBinaryFromReader(message: Project, reader: jspb.BinaryReader): Project;
}

export namespace Project {
  export type AsObject = {
    id: number,
    title: string,
    repository: string,
  }
}

export class Repository extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getName(): string;
  setName(value: string): void;

  getKey(): string;
  setKey(value: string): void;

  clearBranchesList(): void;
  getBranchesList(): Array<Branch>;
  setBranchesList(value: Array<Branch>): void;
  addBranches(value?: Branch, index?: number): Branch;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Repository.AsObject;
  static toObject(includeInstance: boolean, msg: Repository): Repository.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Repository, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Repository;
  static deserializeBinaryFromReader(message: Repository, reader: jspb.BinaryReader): Repository;
}

export namespace Repository {
  export type AsObject = {
    id: number,
    name: string,
    key: string,
    branchesList: Array<Branch.AsObject>,
  }
}

export class Branch extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  clearCommitsList(): void;
  getCommitsList(): Array<Commit>;
  setCommitsList(value: Array<Commit>): void;
  addCommits(value?: Commit, index?: number): Commit;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Branch.AsObject;
  static toObject(includeInstance: boolean, msg: Branch): Branch.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Branch, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Branch;
  static deserializeBinaryFromReader(message: Branch, reader: jspb.BinaryReader): Branch;
}

export namespace Branch {
  export type AsObject = {
    name: string,
    commitsList: Array<Commit.AsObject>,
  }
}

export class Commit extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): void;

  getSha(): string;
  setSha(value: string): void;

  hasTimestamp(): boolean;
  clearTimestamp(): void;
  getTimestamp(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setTimestamp(value?: google_protobuf_timestamp_pb.Timestamp): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Commit.AsObject;
  static toObject(includeInstance: boolean, msg: Commit): Commit.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Commit, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Commit;
  static deserializeBinaryFromReader(message: Commit, reader: jspb.BinaryReader): Commit;
}

export namespace Commit {
  export type AsObject = {
    message: string,
    sha: string,
    timestamp?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class Message extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  hasTimestamp(): boolean;
  clearTimestamp(): void;
  getTimestamp(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setTimestamp(value?: google_protobuf_timestamp_pb.Timestamp): void;

  getMessage(): string;
  setMessage(value: string): void;

  getStatus(): StatusType;
  setStatus(value: StatusType): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Message.AsObject;
  static toObject(includeInstance: boolean, msg: Message): Message.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Message, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Message;
  static deserializeBinaryFromReader(message: Message, reader: jspb.BinaryReader): Message;
}

export namespace Message {
  export type AsObject = {
    id: number,
    timestamp?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    message: string,
    status: StatusType,
  }
}

export class Error extends jspb.Message {
  getCode(): number;
  setCode(value: number): void;

  getField(): string;
  setField(value: string): void;

  getText(): string;
  setText(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Error.AsObject;
  static toObject(includeInstance: boolean, msg: Error): Error.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Error, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Error;
  static deserializeBinaryFromReader(message: Error, reader: jspb.BinaryReader): Error;
}

export namespace Error {
  export type AsObject = {
    code: number,
    field: string,
    text: string,
  }
}

export class EmptyRequest extends jspb.Message {
  getToken(): string;
  setToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EmptyRequest.AsObject;
  static toObject(includeInstance: boolean, msg: EmptyRequest): EmptyRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EmptyRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EmptyRequest;
  static deserializeBinaryFromReader(message: EmptyRequest, reader: jspb.BinaryReader): EmptyRequest;
}

export namespace EmptyRequest {
  export type AsObject = {
    token: string,
  }
}

export class BranchRequest extends jspb.Message {
  getRepoId(): number;
  setRepoId(value: number): void;

  getToken(): string;
  setToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BranchRequest.AsObject;
  static toObject(includeInstance: boolean, msg: BranchRequest): BranchRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BranchRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BranchRequest;
  static deserializeBinaryFromReader(message: BranchRequest, reader: jspb.BinaryReader): BranchRequest;
}

export namespace BranchRequest {
  export type AsObject = {
    repoId: number,
    token: string,
  }
}

export class CommitsRequest extends jspb.Message {
  getRepoId(): number;
  setRepoId(value: number): void;

  getBranchName(): string;
  setBranchName(value: string): void;

  getToken(): string;
  setToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CommitsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CommitsRequest): CommitsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CommitsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CommitsRequest;
  static deserializeBinaryFromReader(message: CommitsRequest, reader: jspb.BinaryReader): CommitsRequest;
}

export namespace CommitsRequest {
  export type AsObject = {
    repoId: number,
    branchName: string,
    token: string,
  }
}

export class BuildRequest extends jspb.Message {
  getProjectId(): number;
  setProjectId(value: number): void;

  getBranch(): string;
  setBranch(value: string): void;

  getSha(): string;
  setSha(value: string): void;

  getToken(): string;
  setToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BuildRequest.AsObject;
  static toObject(includeInstance: boolean, msg: BuildRequest): BuildRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BuildRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BuildRequest;
  static deserializeBinaryFromReader(message: BuildRequest, reader: jspb.BinaryReader): BuildRequest;
}

export namespace BuildRequest {
  export type AsObject = {
    projectId: number,
    branch: string,
    sha: string,
    token: string,
  }
}

export class CopyRequest extends jspb.Message {
  getProjectId(): number;
  setProjectId(value: number): void;

  getSha(): string;
  setSha(value: string): void;

  getToken(): string;
  setToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CopyRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CopyRequest): CopyRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CopyRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CopyRequest;
  static deserializeBinaryFromReader(message: CopyRequest, reader: jspb.BinaryReader): CopyRequest;
}

export namespace CopyRequest {
  export type AsObject = {
    projectId: number,
    sha: string,
    token: string,
  }
}

export class AuthRequest extends jspb.Message {
  getUsername(): string;
  setUsername(value: string): void;

  getPassword(): string;
  setPassword(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AuthRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AuthRequest): AuthRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AuthRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AuthRequest;
  static deserializeBinaryFromReader(message: AuthRequest, reader: jspb.BinaryReader): AuthRequest;
}

export namespace AuthRequest {
  export type AsObject = {
    username: string,
    password: string,
  }
}

export class InstallRequest extends jspb.Message {
  getProjectId(): number;
  setProjectId(value: number): void;

  getSha(): string;
  setSha(value: string): void;

  getColor(): string;
  setColor(value: string): void;

  getToken(): string;
  setToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InstallRequest.AsObject;
  static toObject(includeInstance: boolean, msg: InstallRequest): InstallRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InstallRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InstallRequest;
  static deserializeBinaryFromReader(message: InstallRequest, reader: jspb.BinaryReader): InstallRequest;
}

export namespace InstallRequest {
  export type AsObject = {
    projectId: number,
    sha: string,
    color: string,
    token: string,
  }
}

export class RestartRequest extends jspb.Message {
  getProjectId(): number;
  setProjectId(value: number): void;

  getSha(): string;
  setSha(value: string): void;

  getColor(): string;
  setColor(value: string): void;

  getToken(): string;
  setToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RestartRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RestartRequest): RestartRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RestartRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RestartRequest;
  static deserializeBinaryFromReader(message: RestartRequest, reader: jspb.BinaryReader): RestartRequest;
}

export namespace RestartRequest {
  export type AsObject = {
    projectId: number,
    sha: string,
    color: string,
    token: string,
  }
}

export class MessageResponse extends jspb.Message {
  hasMessage(): boolean;
  clearMessage(): void;
  getMessage(): Message | undefined;
  setMessage(value?: Message): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MessageResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MessageResponse): MessageResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MessageResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MessageResponse;
  static deserializeBinaryFromReader(message: MessageResponse, reader: jspb.BinaryReader): MessageResponse;
}

export namespace MessageResponse {
  export type AsObject = {
    message?: Message.AsObject,
  }
}

export class ListProjectsResponse extends jspb.Message {
  hasProject(): boolean;
  clearProject(): void;
  getProject(): Project | undefined;
  setProject(value?: Project): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListProjectsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListProjectsResponse): ListProjectsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListProjectsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListProjectsResponse;
  static deserializeBinaryFromReader(message: ListProjectsResponse, reader: jspb.BinaryReader): ListProjectsResponse;
}

export namespace ListProjectsResponse {
  export type AsObject = {
    project?: Project.AsObject,
  }
}

export class ListBranchesResponse extends jspb.Message {
  hasBranch(): boolean;
  clearBranch(): void;
  getBranch(): Branch | undefined;
  setBranch(value?: Branch): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListBranchesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListBranchesResponse): ListBranchesResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListBranchesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListBranchesResponse;
  static deserializeBinaryFromReader(message: ListBranchesResponse, reader: jspb.BinaryReader): ListBranchesResponse;
}

export namespace ListBranchesResponse {
  export type AsObject = {
    branch?: Branch.AsObject,
  }
}

export class ListCommitsResponse extends jspb.Message {
  hasCommit(): boolean;
  clearCommit(): void;
  getCommit(): Commit | undefined;
  setCommit(value?: Commit): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListCommitsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListCommitsResponse): ListCommitsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListCommitsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListCommitsResponse;
  static deserializeBinaryFromReader(message: ListCommitsResponse, reader: jspb.BinaryReader): ListCommitsResponse;
}

export namespace ListCommitsResponse {
  export type AsObject = {
    commit?: Commit.AsObject,
  }
}

export class AuthResponse extends jspb.Message {
  hasUser(): boolean;
  clearUser(): void;
  getUser(): User | undefined;
  setUser(value?: User): void;

  clearErrorsList(): void;
  getErrorsList(): Array<Error>;
  setErrorsList(value: Array<Error>): void;
  addErrors(value?: Error, index?: number): Error;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AuthResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AuthResponse): AuthResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AuthResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AuthResponse;
  static deserializeBinaryFromReader(message: AuthResponse, reader: jspb.BinaryReader): AuthResponse;
}

export namespace AuthResponse {
  export type AsObject = {
    user?: User.AsObject,
    errorsList: Array<Error.AsObject>,
  }
}

export enum StatusType {
  UNKNOWN = 0,
  SUCCESS = 1,
  ERROR = 2,
  WARNING = 3,
  PENDING = 4,
}

