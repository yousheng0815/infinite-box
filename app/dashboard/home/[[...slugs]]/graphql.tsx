import { gql } from "@apollo/client"

export const FsItemTreeEntry = gql`
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
`

export const RepoObject = gql`
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
  ${FsItemTreeEntry}
`
