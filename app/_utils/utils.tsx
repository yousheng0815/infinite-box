import {
  CreateCommitOnBranchMutation,
  CreateCommitOnBranchMutationVariables,
  DefaultBranchRefQuery,
  DefaultBranchRefQueryVariables,
  RepoObjectQuery,
  RepoObjectQueryVariables,
} from "@/gql/graphql"
import { ApolloClient, MutationOptions, gql } from "@apollo/client"
import { RepoObject } from "../dashboard/home/[[...slugs]]/page"

export const APP_REPO_NAME = ".infinite-box"

// GitHub GraphQL api doesn't support auto_init option
export const createAppRepo = async (accessToken: string) => {
  const response = await fetch("https://api.github.com/user/repos", {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: APP_REPO_NAME,
      private: true,
      auto_init: true,
    }),
  })
  if (!response.ok) {
    const responseJson = await response.json()
    throw new Error(responseJson.message)
  }
}

export const downloadRepoFile = async (
  accessToken: string,
  owner: string,
  repo: string,
  path: string
) => {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${accessToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  )
  const responseJson = await response.json()

  if (!response.ok) {
    throw new Error(responseJson.message)
  }

  download(responseJson.download_url, responseJson.name)
}

export const download = async (url: string, name: string) => {
  const anchorElement = document.createElement("a")
  anchorElement.href = url
  anchorElement.download = name
  document.body.appendChild(anchorElement)
  anchorElement.click()
  document.body.removeChild(anchorElement)
}

export const getBase64 = async (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader?.result
      if (!result) return reject("FileReader result is null")

      if (typeof result === "string") return resolve(result.split(",")[1])

      const uint8Array = Array.from(new Uint8Array(result))
      resolve(btoa(String.fromCharCode.apply(null, uint8Array)))
    }
    reader.readAsDataURL(file)
  })
}

export const getUnusedName = (name: string, existingNames?: string[]) => {
  while (existingNames?.includes(name)) {
    name += "_copy"
  }
  return name
}

export const getPromiseWithHandlers = <T,>() => {
  let resolve: ((value: T | PromiseLike<T>) => void) | undefined
  let reject: ((reason?: any) => void) | undefined

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

export const getTree = async <T,>(client: ApolloClient<T>, path: string) => {
  const query = await client.query<RepoObjectQuery, RepoObjectQueryVariables>({
    query: RepoObject,
    variables: {
      name: APP_REPO_NAME,
      expression: `HEAD:${path}`,
    },
    fetchPolicy: "network-only",
  })
  if (query.error) throw new Error(query.error.message)
  if (query.errors) throw new Error(query.errors.join(","))
  if (query.data.viewer.repository?.object?.__typename !== "Tree") {
    throw new Error(`${path} is not a tree`)
  }
  return query.data.viewer.repository.object.entries ?? []
}

const APP_REPO_BRANCH = "main"

type FileChanges = {
  additions?: { path: string; file: File }[]
  deletions?: { path: string }[]
}

export const commit = async <T,>(
  client: ApolloClient<T>,
  owner: string,
  fileChanges: FileChanges,
  options?: Omit<
    MutationOptions<
      CreateCommitOnBranchMutation,
      CreateCommitOnBranchMutationVariables
    >,
    "mutation"
  >
) => {
  const additions = await Promise.all(
    fileChanges.additions?.map(async ({ file, path }) => ({
      path,
      contents: await getBase64(file),
    })) ?? []
  )

  const defaultBranchRefQuery = await client.query<
    DefaultBranchRefQuery,
    DefaultBranchRefQueryVariables
  >({
    query: DefaultBranchRef,
    variables: { name: APP_REPO_NAME },
    fetchPolicy: "network-only",
  })

  const defaultBranchOid =
    defaultBranchRefQuery.data?.viewer.repository?.defaultBranchRef?.target?.oid

  if (!defaultBranchOid) throw new Error("Failed to fetch defaultBranchRef")

  return client.mutate<
    CreateCommitOnBranchMutation,
    CreateCommitOnBranchMutationVariables
  >({
    mutation: CreateCommitOnBranch,

    variables: {
      input: {
        branch: {
          repositoryNameWithOwner: `${owner}/${APP_REPO_NAME}`,
          branchName: APP_REPO_BRANCH,
        },
        message: {
          headline: [
            ...(fileChanges.additions?.map(
              (addition) => `Add ${addition.path}`
            ) ?? []),
            ...(fileChanges.deletions?.map(
              (addition) => `Delete ${addition.path}`
            ) ?? []),
          ].join(", "),
        },
        expectedHeadOid: defaultBranchOid,
        fileChanges: {
          additions,
          deletions: fileChanges.deletions,
        },
      },
    },
    ...options,
  })
}

const DefaultBranchRef = gql`
  query DefaultBranchRef($name: String!) {
    viewer {
      repository(name: $name) {
        id
        defaultBranchRef {
          id
          target {
            __typename
            id
            oid
          }
        }
      }
    }
  }
`

const CreateCommitOnBranch = gql`
  mutation CreateCommitOnBranch($input: CreateCommitOnBranchInput!) {
    createCommitOnBranch(input: $input) {
      clientMutationId
    }
  }
`
