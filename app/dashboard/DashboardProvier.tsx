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
import RepositoryLoader from "./RepositoryLoader"

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
    if (accessToken) {
      window.localStorage[LOCAL_STORAGE_KEY_GITHUB_TOKEN] = accessToken
    } else {
      delete window.localStorage[LOCAL_STORAGE_KEY_GITHUB_TOKEN]
      router.push("/")
    }
  }, [accessToken])

  return (
    <ApolloProvider client={client}>
      <RepositoryLoader>{children}</RepositoryLoader>
    </ApolloProvider>
  )
}

export default DashboardProvier
