"use client"

import { BoxProps, Button, ButtonProps } from "@chakra-ui/react"
import React, { forwardRef, useContext, useEffect } from "react"
import { GithubContext } from "../GlobalProvier"
import { useRouter } from "next/navigation"

const LogoutButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const router = useRouter()
    const { setAccessToken } = useContext(GithubContext)

    return (
      <Button ref={ref} onClick={() => setAccessToken(undefined)} {...props}>
        Log out
      </Button>
    )
  }
)

export default LogoutButton
