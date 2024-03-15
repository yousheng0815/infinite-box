"use client"

import { useApolloClient } from "@apollo/client"
import { Button, Input } from "@chakra-ui/react"
import { FC, useContext, useRef, useState } from "react"
import {
  commit,
  getPromiseWithHandlers,
  getTree,
  getUnusedName,
} from "../_utils/utils"
import { RepositoryContext } from "../dashboard/RepositoryProvider"
import { RepoObject } from "../dashboard/home/[[...slugs]]/page"

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
      <Button
        colorScheme="blue"
        onClick={() => inputRef.current?.click()}
        isLoading={isUploading}
      >
        Upload
      </Button>
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
