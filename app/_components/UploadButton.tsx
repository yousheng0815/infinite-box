"use client"

import { useApolloClient } from "@apollo/client"
import { IconButton, Input } from "@chakra-ui/react"
import { faFileCirclePlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FC, useContext, useRef, useState } from "react"
import {
  commit,
  getPromiseWithHandlers,
  getTree,
  getUnusedName,
} from "../_utils/utils"
import { RepositoryContext } from "../dashboard/RepositoryProvider"

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
        boxSize="14"
        colorScheme="green"
        aria-label="Upload file"
        borderRadius="50%"
        pl="2"
        icon={<FontAwesomeIcon size="xl" icon={faFileCirclePlus} />}
        isDisabled={isUploading}
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

          await commit(client, owner, {
            additions: [
              {
                path: `${targetDir}${newFilename}`,
                file,
              },
            ],
          })

          resolve?.()

          setIsUploading(false)

          event.target.value = ""
        }}
      />
    </>
  )
}

export default UploadButton
