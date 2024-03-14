"use client"

import { Button, ButtonProps } from "@chakra-ui/react"
import React, { forwardRef, useContext, useEffect } from "react"
import { GithubContext } from "./GlobalProvier"
import { useRouter } from "next/navigation"

const OAUTH_URL =
  "https://github.com/login/oauth/authorize?client_id=4f7dbe0973b61df3ae66&scope=repo user"

type OauthResult = {
  access_token?: string
  scope?: string[]
  token_type?: string
  error?: string
  error_description?: string
}

const LoginButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const router = useRouter()
  const { accessToken, setAccessToken } = useContext(GithubContext)

  useEffect(() => {
    const handleMessage = (event: MessageEvent<OauthResult>) => {
      if (event.origin !== window.origin) return

      const { access_token } = event.data
      if (access_token) {
        setAccessToken(access_token)
        router.push("/dashboard/home")
      }

      //TODO: Handle Oauth errors
    }
    window.addEventListener("message", handleMessage)

    return () => window.removeEventListener("message", handleMessage)
  }, [])

  return accessToken ? (
    <Button ref={ref} onClick={() => router.push("/dashboard")} {...props}>
      Go to dashboard
    </Button>
  ) : (
    <Button
      ref={ref}
      onClick={() => {
        const [width, height] = [600, 560]
        const left = (window.innerWidth - width) / 2
        const top = (window.innerHeight - height) / 2
        const oauthWindow = window.open(
          OAUTH_URL,
          "OAuth",
          `width=${width},height=${height},left=${left},top=${top}`
        )
        oauthWindow?.focus()
      }}
      {...props}
    >
      Log in with GitHub
    </Button>
  )
})

export default LoginButton
