"use client"

import {
  AppRepoHeadTreeQuery,
  AppRepoHeadTreeQueryVariables,
  RepositoryVisibility,
} from "@/gql/graphql"
import { gql, useMutation, useQuery } from "@apollo/client"
import { Box } from "@chakra-ui/react"
import { FC, useContext } from "react"
import { GithubContext } from "../GlobalProvier"
import { APP_REPO_NAME, createAppRepo } from "./utils"

const Dashboard: FC = (props) => {
  const query = useQuery<AppRepoHeadTreeQuery, AppRepoHeadTreeQueryVariables>(
    AppRepoHeadTree,
    {
      variables: {
        name: APP_REPO_NAME,
      },
    }
  )

  const tree =
    query.data?.viewer.repository?.object?.__typename === "Commit" &&
    query.data?.viewer.repository?.object?.tree

  if (!tree) return null //TODO: Display an error message

  return <Box>{tree.entries?.map((x) => x.name)}</Box>
}

const AppRepoHeadTree = gql`
  query AppRepoHeadTree($name: String!) {
    viewer {
      repository(name: $name) {
        id
        object(expression: "HEAD") {
          id
          ... on Commit {
            tree {
              id
              entries {
                name
                type
                oid
                path
                size
              }
            }
          }
        }
      }
    }
  }
`

export default Dashboard
