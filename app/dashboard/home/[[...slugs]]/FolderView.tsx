import CreateFolderButton from "@/app/_components/CreateFolderButton"
import FsItem from "@/app/_components/FileSystemItem"
import UploadButton from "@/app/_components/UploadButton"
import { APP_REPO_NAME, downloadRepoFile } from "@/app/_utils/utils"
import { Box, BoxProps, Flex, Spinner } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { FC, useContext, useState } from "react"
import { RepositoryContext } from "../../RepositoryProvider"
import { FsItemTreeEntryFragment } from "@/gql/graphql"

interface Props extends BoxProps {
  folderPath: string
  entries?: FsItemTreeEntryFragment[] | null
}

const FolderView: FC<Props> = ({ folderPath, entries, ...boxProps }) => {
  const { accessToken, owner } = useContext(RepositoryContext)
  const router = useRouter()
  const [uploadingObjects, setUploadingObjects] = useState<
    { name: string; type: "Blob" | "Tree" }[]
  >([])

  return (
    <>
      <Flex flexWrap="wrap">
        {entries
          ?.filter((entry) => !entry.name.startsWith("."))
          .map((entry) => {
            return (
              <FsItem
                key={entry.name}
                onOpen={() => {
                  if (entry.object?.__typename === "Tree") {
                    router.push(`/dashboard/home/${entry.path}`)
                  } else if (entry.object?.__typename === "Blob") {
                    if (owner && entry.path)
                      //TODO: handle null values
                      downloadRepoFile(
                        accessToken,
                        owner,
                        APP_REPO_NAME,
                        entry.path
                      )
                  }
                }}
                treeEntry={entry}
              />
            )
          })}
        {uploadingObjects.map((uploadingFile) => (
          <Box key={uploadingFile.name} position="relative">
            <FsItem
              treeEntry={{
                name: uploadingFile.name,
                object: {
                  __typename: uploadingFile.type,
                  id: "",
                  oid: "",
                },
              }}
              opacity={0.6}
            />
            <Flex
              position="absolute"
              inset="0 0 0 0"
              alignItems="center"
              justifyContent="center"
            >
              <Spinner size="sm" color="white" />
            </Flex>
          </Box>
        ))}
      </Flex>
      <Flex position="fixed" right="0" bottom="0" gap="3" p="4">
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
    </>
  )
}

export default FolderView
