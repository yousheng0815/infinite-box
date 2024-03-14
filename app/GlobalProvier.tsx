"use client"

import { ChakraProvider } from "@chakra-ui/react"
import { Dispatch, FC, PropsWithChildren, createContext, useState } from "react"
import { LOCAL_STORAGE_KEY_GITHUB_TOKEN } from "./dashboard/DashboardProvier"

type GithubContextType = {
  accessToken: string | undefined
  setAccessToken: Dispatch<string | undefined>
}

export const GithubContext = createContext<GithubContextType>({
  accessToken: undefined,
  setAccessToken: () => {},
})

const GlobalProvier: FC<PropsWithChildren> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | undefined>(
    typeof window !== "undefined"
      ? window.localStorage[LOCAL_STORAGE_KEY_GITHUB_TOKEN]
      : undefined
  )

  return (
    <ChakraProvider>
      <GithubContext.Provider
        value={{
          accessToken,
          setAccessToken: (accessToken: string | undefined) => {
            if (accessToken) {
              window.localStorage[LOCAL_STORAGE_KEY_GITHUB_TOKEN] = accessToken
            } else {
              delete window.localStorage[LOCAL_STORAGE_KEY_GITHUB_TOKEN]
            }
            setAccessToken(accessToken)
          },
        }}
      >
        {children}
      </GithubContext.Provider>
    </ChakraProvider>
  )
}

export default GlobalProvier
