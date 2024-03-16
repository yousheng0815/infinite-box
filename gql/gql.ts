/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query DefaultBranchRef($name: String!) {\n    viewer {\n      repository(name: $name) {\n        id\n        defaultBranchRef {\n          id\n          target {\n            __typename\n            id\n            oid\n          }\n        }\n      }\n    }\n  }\n": types.DefaultBranchRefDocument,
    "\n  mutation CreateCommitOnBranch($input: CreateCommitOnBranchInput!) {\n    createCommitOnBranch(input: $input) {\n      clientMutationId\n    }\n  }\n": types.CreateCommitOnBranchDocument,
    "\n  query AppRepo($name: String!) {\n    viewer {\n      repository(name: $name) {\n        id\n        owner {\n          id\n          login\n        }\n      }\n    }\n  }\n": types.AppRepoDocument,
    "\n  fragment FsItemTreeEntry on TreeEntry {\n    name\n    oid\n    path\n    size\n    object {\n      id\n      oid\n    }\n  }\n": types.FsItemTreeEntryFragmentDoc,
    "\n  query RepoObject($name: String!, $expression: String) {\n    viewer {\n      repository(name: $name) {\n        id\n        object(expression: $expression) {\n          id\n          ... on Tree {\n            entries {\n              ...FsItemTreeEntry\n            }\n          }\n        }\n      }\n    }\n  }\n": types.RepoObjectDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query DefaultBranchRef($name: String!) {\n    viewer {\n      repository(name: $name) {\n        id\n        defaultBranchRef {\n          id\n          target {\n            __typename\n            id\n            oid\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query DefaultBranchRef($name: String!) {\n    viewer {\n      repository(name: $name) {\n        id\n        defaultBranchRef {\n          id\n          target {\n            __typename\n            id\n            oid\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCommitOnBranch($input: CreateCommitOnBranchInput!) {\n    createCommitOnBranch(input: $input) {\n      clientMutationId\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCommitOnBranch($input: CreateCommitOnBranchInput!) {\n    createCommitOnBranch(input: $input) {\n      clientMutationId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AppRepo($name: String!) {\n    viewer {\n      repository(name: $name) {\n        id\n        owner {\n          id\n          login\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query AppRepo($name: String!) {\n    viewer {\n      repository(name: $name) {\n        id\n        owner {\n          id\n          login\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment FsItemTreeEntry on TreeEntry {\n    name\n    oid\n    path\n    size\n    object {\n      id\n      oid\n    }\n  }\n"): (typeof documents)["\n  fragment FsItemTreeEntry on TreeEntry {\n    name\n    oid\n    path\n    size\n    object {\n      id\n      oid\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query RepoObject($name: String!, $expression: String) {\n    viewer {\n      repository(name: $name) {\n        id\n        object(expression: $expression) {\n          id\n          ... on Tree {\n            entries {\n              ...FsItemTreeEntry\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query RepoObject($name: String!, $expression: String) {\n    viewer {\n      repository(name: $name) {\n        id\n        object(expression: $expression) {\n          id\n          ... on Tree {\n            entries {\n              ...FsItemTreeEntry\n            }\n          }\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;