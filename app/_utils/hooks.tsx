import {
  CreateCommitOnBranchMutation,
  CreateCommitOnBranchMutationVariables,
  DefaultBranchRefQuery,
  DefaultBranchRefQueryVariables,
} from "@/gql/graphql"
import { gql, useLazyQuery, useMutation } from "@apollo/client"
import { useContext } from "react"
import { RepositoryContext } from "../dashboard/RepositoryProvider"
import { APP_REPO_NAME, getBase64 } from "./utils"

const APP_REPO_BRANCH = "main"

type FileChanges = {
  additions?: { path: string; file: File }[]
  deletions?: { path: string }[]
}

export const useCreateCommitOnBranchMutation = () => {
  const { owner } = useContext(RepositoryContext)

  const [getDefaultBranchRef] = useLazyQuery<
    DefaultBranchRefQuery,
    DefaultBranchRefQueryVariables
  >(DefaultBranchRef, {
    variables: { name: APP_REPO_NAME },
    fetchPolicy: "network-only",
  })

  const [createCommitOnBranch, createCommitOnBranchResult] = useMutation<
    CreateCommitOnBranchMutation,
    CreateCommitOnBranchMutationVariables
  >(CreateCommitOnBranch)

  const patchedCreateCommitOnBranch = async (
    fileChanges: FileChanges,
    options?: Parameters<typeof createCommitOnBranch>[0]
  ) => {
    const additions = await Promise.all(
      fileChanges.additions?.map(async ({ file, path }) => ({
        path,
        contents: await getBase64(file),
      })) ?? []
    )

    const getDefaultBranchRefQuery = await getDefaultBranchRef()
    const defaultBranchOid =
      getDefaultBranchRefQuery.data?.viewer.repository?.defaultBranchRef?.target
        ?.oid

    if (!defaultBranchOid) throw new Error("Failed to fetch defaultBranchRef")

    createCommitOnBranch({
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

  return [patchedCreateCommitOnBranch, createCommitOnBranchResult] as const
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
