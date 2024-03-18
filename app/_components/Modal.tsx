"use client"

import {
  Modal as ChakraModal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/react"
import { FC } from "react"

interface Props extends ModalProps {}

const Modal: FC<Props> = ({ children, ...modalProps }) => {
  return (
    <ChakraModal isCentered {...modalProps}>
      <ModalOverlay />
      <ModalContent m="4">
        <ModalCloseButton />
        {children}
      </ModalContent>
    </ChakraModal>
  )
}

export default Modal
