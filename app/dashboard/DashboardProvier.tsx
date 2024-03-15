"use client"

import { ChakraProvider, Spinner } from "@chakra-ui/react"
import {
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
} from "react"
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from "@apollo/client"
import { GithubContext } from "../GlobalProvier"
import { useRouter } from "next/navigation"
import RepositoryProvider from "./RepositoryProvider"

export const LOCAL_STORAGE_KEY_GITHUB_TOKEN = "GITHUB_TOKEN"

let token: string | undefined

const httpLink = new HttpLink({
  uri: "https://api.github.com/graphql",
  fetch: (uri, options = {}) => {
    options.headers = {
      ...options.headers,
      authorization: `Bearer ${token}`,
    }
    return fetch(uri, options)
  },
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})

const DashboardProvier: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter()

  const { accessToken } = useContext(GithubContext)
  token = accessToken

  useLayoutEffect(() => {
    if (!accessToken) router.push("/")
  }, [accessToken, router])

  return (
    <ApolloProvider client={client}>
      <RepositoryProvider>{children}</RepositoryProvider>
    </ApolloProvider>
  )
}

export default DashboardProvier
