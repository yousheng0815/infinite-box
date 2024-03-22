import CreateFolderButton from "@/app/_components/CreateFolderButton"
import FsItem from "@/app/_components/FileSystemItem"
import UploadButton from "@/app/_components/UploadButton"
import { APP_REPO_NAME, commit, getFileInfo } from "@/app/_utils/utils"
import { FsItemTreeEntryFragment } from "@/gql/graphql"
import { useApolloClient } from "@apollo/client"
import { Box, BoxProps, Flex, useDisclosure } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { FC, useContext, useState } from "react"
import { RepositoryContext } from "../../RepositoryProvider"
import PreivewModal from "./PreivewModal"

interface Props extends BoxProps {
  folderPath: string
  entries?: FsItemTreeEntryFragment[] | null
}

const FolderView: FC<Props> = ({ folderPath, entries, ...boxProps }) => {
  const client = useApolloClient()

  const { accessToken, owner } = useContext(RepositoryContext)
  const router = useRouter()
  const [removingObjectNames, setRemovingObjectNames] = useState<string[]>([])
  const [uploadingObjects, setUploadingObjects] = useState<
    { name: string; type: "Blob" | "Tree" }[]
  >([])

  const {
    isOpen: isPreviewModalOpen,
    onOpen: onPreviewModalOpen,
    onClose: onPreviewModalClose,
  } = useDisclosure()
  const [previewFile, setPreviewFile] = useState<{
    name: string
    blob?: Blob
  }>()

  return (
    <>
      <Box {...boxProps}>
        <Flex flexWrap="wrap">
          {entries
            ?.filter((entry) => !entry.name.startsWith("."))
            .map((entry) => {
              return (
                <FsItem
                  key={entry.name}
                  isLoading={removingObjectNames.includes(entry.name)}
                  onOpen={async () => {
                    if (entry.object?.__typename === "Tree") {
                      router.push(`/dashboard/home/${entry.path}`)
                    } else if (entry.object?.__typename === "Blob") {
                      if (owner && entry.path) {
                        setPreviewFile({ name: entry.name })
                        onPreviewModalOpen()
                        const fileContent = await getFileInfo(
                          accessToken,
                          owner,
                          APP_REPO_NAME,
                          entry.path
                        )
                        const response = await fetch(fileContent.download_url)
                        setPreviewFile({
                          name: entry.name,
                          blob: await response.blob(),
                        })
                      }
                    }
                  }}
                  treeEntry={entry}
                  optionGroups={[
                    //TODO: Open and Info options
                    [
                      {
                        color: "red.500",
                        children: "Delete",
                        onClick: async () => {
                          setRemovingObjectNames((removingObjects) => [
                            ...removingObjects,
                            entry.name,
                          ])

                          if (entry.path) {
                            await commit(client, owner, {
                              deletions: [{ path: entry.path }],
                            })
                          }

                          setRemovingObjectNames((removingObjects) =>
                            removingObjects.filter((x) => x !== entry.name)
                          )
                        },
                      },
                    ],
                  ]}
                />
              )
            })}
          {uploadingObjects.map((uploadingFile) => (
            <FsItem
              key={uploadingFile.name}
              isLoading
              treeEntry={{
                name: uploadingFile.name,
                object: {
                  __typename: uploadingFile.type,
                  id: "",
                  oid: "",
                },
              }}
            />
          ))}
        </Flex>
        <Flex position="fixed" right="0" bottom="0" gap="4" p="4">
          <CreateFolderButton
            targetDir={folderPath}
            onCreate={async (folderName, uploadPromise) => {
              setUploadingObjects((uploadingObjects) => [
                ...uploadingObjects,
                { name: folderName, type: "Tree" },
              ])
              await uploadPromise
              setUploadingObjects((uploadingFiles) =>
                uploadingFiles.filter((x) => x.name !== folderName)
              )
            }}
          />
          <UploadButton
            targetDir={folderPath}
            onUpload={async (filename, uploadPromise) => {
              setUploadingObjects((uploadingObjects) => [
                ...uploadingObjects,
                { name: filename, type: "Blob" },
              ])
              await uploadPromise
              setUploadingObjects((uploadingFiles) =>
                uploadingFiles.filter((x) => x.name !== filename)
              )
            }}
          />
        </Flex>
      </Box>
      <PreivewModal
        previewFile={previewFile}
        isOpen={isPreviewModalOpen}
        onClose={() => {
          onPreviewModalClose()
          setPreviewFile(undefined)
        }}
      />
    </>
  )
}

export default FolderView
