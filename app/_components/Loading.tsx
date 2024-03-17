"use client"

import { Flex, FlexProps, Spinner, SpinnerProps } from "@chakra-ui/react"
import { FC } from "react"

interface Props extends FlexProps {
  size?: SpinnerProps["size"]
}

const Loading: FC<Props> = ({ size, ...flexProps }) => {
  return (
    <Flex
      boxSize="full"
      alignItems="center"
      justifyContent="center"
      {...flexProps}
    >
      <Spinner size={size} />
    </Flex>
  )
}

export default Loading
