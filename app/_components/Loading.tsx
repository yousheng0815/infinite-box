"use client"

import { Flex, FlexProps, Spinner } from "@chakra-ui/react"
import { FC } from "react"

const Loading: FC<FlexProps> = (props) => {
  return (
    <Flex boxSize="full" alignItems="center" justifyContent="center" {...props}>
      <Spinner />
    </Flex>
  )
}

export default Loading
