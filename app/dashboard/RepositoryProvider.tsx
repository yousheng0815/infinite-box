"use client"

import { Box, Flex, Spinner } from "@chakra-ui/react"
import { FC, PropsWithChildren, createContext, useContext } from "react"
import { gql, useQuery } from "@apollo/client"
import { GithubContext } from "../GlobalProvier"
import { APP_REPO_NAME, createAppRepo } from "../_utils/utils"
import { AppRepoQuery, AppRepoQueryVariables } from "@/gql/graphql"

type RepositoryContextType = {
  accessToken: string
  owner: string
}

export const RepositoryContext = createContext<RepositoryContextType>({
  accessToken: "",
  owner: "",
})

const RepositoryProvider: FC<PropsWithChildren> = ({ children }) => {
  const { accessToken } = useContext(GithubContext)

  const query = useQuery<AppRepoQuery, AppRepoQueryVariables>(AppRepo, {
    variables: { name: APP_REPO_NAME },
    onError: async (error) => {
      const shouldCreateAppRepo = error.graphQLErrors.some(
        (error) => "type" in error && error.type === "NOT_FOUND"
      )
      if (shouldCreateAppRepo && accessToken) {
        try {
          await createAppRepo(accessToken)
          query.refetch()
        } catch (e) {
          console.error(e) //TODO: Display the error message
        }
      }
    },
  })

  const owner = query.data?.viewer.repository?.owner.login

  return accessToken && owner ? (
    <RepositoryContext.Provider value={{ accessToken, owner }}>
      {children}
    </RepositoryContext.Provider>
  ) : (
    <Flex
      width="full"
      height="100dvh"
      alignItems="center"
      justifyContent="center"
    >
      <Spinner />
    </Flex>
  )
}

const AppRepo = gql`
  query AppRepo($name: String!) {
    viewer {
      repository(name: $name) {
        id
        owner {
          id
          login
        }
      }
    }
  }
`

export default RepositoryProvider
