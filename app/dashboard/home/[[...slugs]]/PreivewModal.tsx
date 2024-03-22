import Loading from "@/app/_components/Loading"
import Modal from "@/app/_components/Modal"
import {
  Box,
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@chakra-ui/react"
import { FC } from "react"

export type PreviewFile = {
  name: string
  blob?: Blob
}

interface Props extends Omit<ModalProps, "children"> {
  previewFile?: PreviewFile
}

const PreivewModal: FC<Props> = ({ previewFile, ...modalProps }) => {
  return (
    <Modal size="xl" scrollBehavior="inside" {...modalProps}>
      <ModalHeader>{previewFile?.name}</ModalHeader>
      <ModalBody>
        {previewFile?.blob ? (
          previewFile.blob.type.startsWith("image/") ? (
            <Box
              as="img"
              objectFit="contain"
              m="auto"
              boxSize="fit-content"
              maxH="60dvh"
              maxW="full"
              src={URL.createObjectURL(previewFile.blob)}
            />
          ) : previewFile.blob.type.startsWith("video/") ? (
            <Box
              as="video"
              controls
              m="auto"
              boxSize="fit-content"
              maxH="60dvh"
              maxW="full"
            >
              <source src={URL.createObjectURL(previewFile.blob)} />
            </Box>
          ) : previewFile.blob.type.startsWith("text/") ? (
            <iframe
              width="100%"
              height="100%"
              src={URL.createObjectURL(previewFile.blob)}
            />
          ) : (
            "Can't preview file"
          )
        ) : (
          <Loading />
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          colorScheme="blue"
          disabled={!previewFile?.blob}
          onClick={() => {
            if (!previewFile?.blob) return

            const anchor = document.createElement("a")
            anchor.href = URL.createObjectURL(previewFile.blob)
            anchor.download = previewFile.name

            document.body.appendChild(anchor)
            anchor.click()
            document.body.removeChild(anchor)
          }}
        >
          Download
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default PreivewModal
