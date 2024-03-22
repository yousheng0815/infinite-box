import Modal from "@/app/_components/Modal"
import { formatBytes } from "@/app/_utils/utils"
import { FsItemTreeEntryFragment } from "@/gql/graphql"
import {
  Box,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@chakra-ui/react"
import { FC } from "react"

interface Props extends Omit<ModalProps, "children"> {
  fileInfo?: FsItemTreeEntryFragment
}

const InfoModal: FC<Props> = ({ fileInfo, ...modalProps }) => {
  if (!fileInfo) return null

  return (
    <Modal size="xl" scrollBehavior="inside" {...modalProps}>
      <ModalHeader>{fileInfo.name}</ModalHeader>
      <ModalBody>
        {fileInfo.path && <Box>Path: {fileInfo.path}</Box>}
        <Box>Extension: {fileInfo.extension}</Box>
        <Box>File size: {formatBytes(fileInfo.size)}</Box>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  )
}

export default InfoModal
