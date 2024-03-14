"use client"

import FsItem, { FsItemTreeEntry } from "@/app/_components/FileSystemItem"
import { gql, useQuery } from "@apollo/client"
import { Box, Button, Flex, Grid, Spinner } from "@chakra-ui/react"
import { FC, Fragment, useContext } from "react"
import { APP_REPO_NAME, downloadRepoFile } from "../../../_utils/utils"
import { RepoObjectQuery, RepoObjectQueryVariables } from "@/gql/graphql"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { RepositoryContext } from "../../RepositoryProvider"
import UploadButton from "@/app/_components/UploadButton"

interface Props {
  params: { slugs?: string[] }
}

const Browse: FC<Props> = ({ params: { slugs = [] } }) => {
  const path = slugs.map((slug) => `${slug}/`).join("")

  const navSlugs = [
    { name: "Home", path: "" },
    ...slugs.map((slug, i, array) => ({
      name: slug,
      path: array.slice(0, i + 1).join("/"),
    })),
  ]

  const { accessToken, owner } = useContext(RepositoryContext)
  const router = useRouter()

  const objectQuery = useQuery<RepoObjectQuery, RepoObjectQueryVariables>(
    RepoObject,
    {
      variables: {
        name: APP_REPO_NAME,
        expression: `HEAD:${path}`,
      },
      fetchPolicy: "network-only",
    }
  )
  const object = objectQuery.data?.viewer.repository?.object

  return (
    <Grid gap="4">
      <Flex gap="1">
        {navSlugs.map((slug, i, array) => (
          <Fragment key={i}>
            <Link key="i" href={`/dashboard/home/${slug.path}`}>
              {slug.name}
            </Link>
            {i < array.length - 1 && "/"}
          </Fragment>
        ))}
      </Flex>
      {objectQuery.loading ? (
        <Spinner />
      ) : object?.__typename === "Tree" ? (
        <>
          <Flex flexWrap="wrap">
            {object.entries
              ?.filter((entry) => !entry.name.startsWith("."))
              .map((entry) => {
                return (
                  <FsItem
                    key={entry.oid}
                    onOpen={() => {
                      if (entry.object?.__typename === "Tree") {
                        router.push(`/dashboard/home/${entry.path}`)
                      } else if (entry.object?.__typename === "Blob") {
                        if (owner && entry.path)
                          //TODO: handle null values
                          downloadRepoFile(
                            accessToken,
                            owner,
                            APP_REPO_NAME,
                            entry.path
                          )
                      }
                    }}
                    {...entry}
                  />
                )
              })}
          </Flex>
          <UploadButton targetDir={path} />
        </>
      ) : object?.__typename === "Blob" ? (
        <Button onClick={() => {}}>Download</Button>
      ) : (
        "Not found" //TODO: Not found page
      )}
    </Grid>
  )
}

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

export default Browse
