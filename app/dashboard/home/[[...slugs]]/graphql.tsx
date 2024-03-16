import { graphql } from "@/gql/gql"
import { gql } from "@apollo/client"

export const FsItemTreeEntry = graphql(`
  fragment FsItemTreeEntry on TreeEntry {
    name
    oid
    path
    size
    object {
      id
      oid
    }
  }
`)

export const RepoObject = graphql(`
  query RepoObject($name: String!, $expression: String) {
    viewer {
      repository(name: $name) {
        id
        object(expression: $expression) {
          id
          ... on Tree {
            entries {
              ...FsItemTreeEntry
            }
          }
        }
      }
    }
  }
`)
