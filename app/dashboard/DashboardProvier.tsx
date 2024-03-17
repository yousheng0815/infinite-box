"use client"

import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client"
import { useRouter } from "next/navigation"
import { FC, PropsWithChildren, useContext, useEffect } from "react"
import { GithubContext } from "../GlobalProvier"
import RepositoryProvider from "./RepositoryProvider"

export const LOCAL_STORAGE_KEY_GITHUB_TOKEN = "GITHUB_TOKEN"

let token: string | undefined | null

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

  useEffect(() => {
    if (!accessToken) router.push("/")
  }, [accessToken, router])

  return (
    <ApolloProvider client={client}>
      <RepositoryProvider>{children}</RepositoryProvider>
    </ApolloProvider>
  )
}

export default DashboardProvier
