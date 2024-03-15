"use client"

import { useApolloClient } from "@apollo/client"
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react"
import { FC, useContext, useState } from "react"
import {
  commit,
  getPromiseWithHandlers,
  getTree,
  getUnusedName,
} from "../_utils/utils"
import { RepositoryContext } from "../dashboard/RepositoryProvider"
import { RepoObject } from "../dashboard/home/[[...slugs]]/graphql"

interface Props {
  targetDir: string
  onCreate?: (folderName: string, createPromise: Promise<void>) => void
}

const CreateFolderButton: FC<Props> = ({ targetDir, onCreate }) => {
  const { owner } = useContext(RepositoryContext)

  const client = useApolloClient()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [isUploading, setIsUploading] = useState(false)

  const [folderName, setFolderName] = useState("")

  return (
    <>
      <Button colorScheme="blue" isLoading={isUploading} onClick={onOpen}>
        New Folder
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <form //TODO: Consider using a form library
            onSubmit={async (e) => {
              e.preventDefault()

              onClose()
              setFolderName("")

              setIsUploading(true)

              const targetTree = await getTree(client, targetDir)
              const existingNames = targetTree.map((entry) => entry.name)
              const newFolderName = getUnusedName(folderName, existingNames)

              const { promise, resolve } = getPromiseWithHandlers<void>()

              onCreate?.(newFolderName, promise)

              const emptyFile = new File([new Blob([])], "")

              await commit(
                client,
                owner,
                {
                  additions: [
                    {
                      path: `${targetDir}${newFolderName}/._`,
                      file: emptyFile,
                    },
                  ],
                },
                {
                  refetchQueries: [RepoObject],
                }
              )

              resolve?.()

              setIsUploading(false)
            }}
          >
            <ModalHeader>Create Folder</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isRequired>
                <FormLabel>Folder name</FormLabel>
                <Input
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  required
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Create
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateFolderButton
