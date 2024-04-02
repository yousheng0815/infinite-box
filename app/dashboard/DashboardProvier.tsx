"use client"

import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client"
import { useRouter } from "next/navigation"
import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
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

type DashboardContext = {
  search: string
  setSearch: Dispatch<SetStateAction<string>>
}
export const dashboardContext = createContext<DashboardContext>({
  search: "",
  setSearch: () => {},
})

const DashboardProvier: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter()

  const { accessToken } = useContext(GithubContext)
  token = accessToken

  useEffect(() => {
    if (!accessToken) router.push("/")
  }, [accessToken, router])

  const [search, setSearch] = useState("")

  return (
    <ApolloProvider client={client}>
      <RepositoryProvider>
        <dashboardContext.Provider value={{ search, setSearch }}>
          {children}
        </dashboardContext.Provider>
      </RepositoryProvider>
    </ApolloProvider>
  )
}

export default DashboardProvier
