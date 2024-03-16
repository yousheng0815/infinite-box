"use client"

import { useApolloClient } from "@apollo/client"
import { Button, IconButton, Input } from "@chakra-ui/react"
import { FC, useContext, useRef, useState } from "react"
import {
  commit,
  getPromiseWithHandlers,
  getTree,
  getUnusedName,
} from "../_utils/utils"
import { RepositoryContext } from "../dashboard/RepositoryProvider"
import { RepoObject } from "../dashboard/home/[[...slugs]]/graphql"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileCirclePlus } from "@fortawesome/free-solid-svg-icons"

interface Props {
  targetDir: string
  onUpload?: (filename: string, uploadPromise: Promise<void>) => void
}

const UploadButton: FC<Props> = ({ targetDir, onUpload }) => {
  const { owner } = useContext(RepositoryContext)

  const client = useApolloClient()

  const inputRef = useRef<HTMLInputElement>(null)

  const [isUploading, setIsUploading] = useState(false)

  return (
    <>
      <IconButton
        boxSize="12"
        colorScheme="green"
        aria-label="Upload file"
        borderRadius="50%"
        pl="1"
        icon={<FontAwesomeIcon size="lg" icon={faFileCirclePlus} />}
        isLoading={isUploading}
        onClick={() => inputRef.current?.click()}
      />
      <Input
        ref={inputRef}
        type="file"
        display="none"
        onChange={async (event) => {
          const file = event.target.files?.[0]
          if (!file) return

          setIsUploading(true)

          const targetTree = await getTree(client, targetDir)
          const existingNames = targetTree.map((entry) => entry.name)
          const newFilename = getUnusedName(file.name, existingNames)

          const { promise, resolve } = getPromiseWithHandlers<void>()

          onUpload?.(newFilename, promise)

          await commit(
            client,
            owner,
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

          resolve?.()

          setIsUploading(false)

          event.target.value = ""
        }}
      />
    </>
  )
}

export default UploadButton
