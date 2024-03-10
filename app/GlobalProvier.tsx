"use client"

import { ChakraProvider } from "@chakra-ui/react"
import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client"

type GithubContextType = {
  accessToken: string | undefined
  setAccessToken: Dispatch<SetStateAction<string | undefined>>
}

export const GithubContext = createContext<GithubContextType>({
  accessToken: undefined,
  setAccessToken: () => {},
})

const GlobalProvier: FC<PropsWithChildren> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string>()

  return (
    <ChakraProvider>
      <GithubContext.Provider value={{ accessToken, setAccessToken }}>
        {children}
      </GithubContext.Provider>
    </ChakraProvider>
  )
}

export default GlobalProvier
