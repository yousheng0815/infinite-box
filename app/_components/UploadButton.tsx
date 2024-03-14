"use client"

import { RepoObjectQuery, RepoObjectQueryVariables } from "@/gql/graphql"
import { useLazyQuery } from "@apollo/client"
import { Button, Input } from "@chakra-ui/react"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FC, useRef } from "react"
import { useCreateCommitOnBranchMutation } from "../_utils/hooks"
import { APP_REPO_NAME } from "../_utils/utils"
import { RepoObject } from "../dashboard/home/[[...slugs]]/page"

interface Props {
  targetDir: string
}

const UploadButton: FC<Props> = ({ targetDir }) => {
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
      <Button
        boxSize="3rem"
        borderRadius="50%"
        colorScheme="blue"
        onClick={() => inputRef.current?.click()}
      >
        <FontAwesomeIcon icon={faPlus} size="lg" color="white" />
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

          createCommitOnBranch(
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

          event.target.value = ""
        }}
      />
    </>
  )
}

export default UploadButton
