"use client"

import { Box, BoxProps, Flex, Input, useColorModeValue } from "@chakra-ui/react"
import React, { FC, forwardRef } from "react"
import LogoutButton from "./LogoutButton"

const Topbar = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  return (
    <Flex ref={ref} {...props} gap="4">
      <Input placeholder="Search" />
      <LogoutButton />
    </Flex>
  )
})

export default Topbar
