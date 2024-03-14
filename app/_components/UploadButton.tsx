"use client"

import { RepoObjectQuery, RepoObjectQueryVariables } from "@/gql/graphql"
import { useLazyQuery } from "@apollo/client"
import { Button, Input } from "@chakra-ui/react"
import { FC, useRef } from "react"
import { useCreateCommitOnBranchMutation } from "../_utils/hooks"
import { APP_REPO_NAME } from "../_utils/utils"
import { RepoObject } from "../dashboard/home/[[...slugs]]/page"

interface Props {
  targetDir: string
  onUpload?: (filename: string, uploadPromise: Promise<void>) => void
}

const UploadButton: FC<Props> = ({ targetDir, onUpload }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const [createCommitOnBranch] = useCreateCommitOnBranchMutation()

  const [getObject] = useLazyQuery<RepoObjectQuery, RepoObjectQueryVariables>(
    RepoObject,
    {
      variables: {
        name: APP_REPO_NAME,
        expression: `HEAD:${targetDir}`,
      },
      fetchPolicy: "network-only",
    }
  )

  return (
    <>
      <Button colorScheme="blue" onClick={() => inputRef.current?.click()}>
        Upload
      </Button>
      <Input
        ref={inputRef}
        type="file"
        display="none"
        onChange={async (event) => {
          const file = event.target.files?.[0]
          if (!file) return

          const getObjectQuery = await getObject()
          const object = getObjectQuery.data?.viewer.repository?.object
          if (object?.__typename !== "Tree") {
            throw new Error("Failed to fetch target directory info")
          }

          const existingFilenames = object.entries?.map((entry) => entry.name)
          let newFilename = file.name
          while (existingFilenames?.includes(newFilename)) {
            newFilename += "_copy"
          }

          let resolveUpload:
            | ((value: void | PromiseLike<void>) => void)
            | undefined

          onUpload?.(
            newFilename,
            new Promise((res) => {
              resolveUpload = res
            })
          )

          await createCommitOnBranch(
            {
              additions: [
                {
                  path: `${targetDir}${newFilename}`,
                  file,
                },
              ],
            },
            {
              refetchQueries: [RepoObject],
            }
          )

          resolveUpload?.()

          event.target.value = ""
        }}
      />
    </>
  )
}

export default UploadButton
