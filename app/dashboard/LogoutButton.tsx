"use client"

import { Button, ButtonProps } from "@chakra-ui/react"
import { forwardRef, useContext } from "react"
import { GithubContext } from "../GlobalProvier"

const LogoutButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { setAccessToken } = useContext(GithubContext)

    return (
      <Button ref={ref} onClick={() => setAccessToken(undefined)} {...props}>
        Log out
      </Button>
    )
  }
)

export default LogoutButton
