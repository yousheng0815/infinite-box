"use client"

import { useQuery } from "@apollo/client"
import { Button, Flex, Grid, Spinner } from "@chakra-ui/react"
import Link from "next/link"
import { FC, Fragment } from "react"
import { APP_REPO_NAME } from "../../../_utils/utils"
import FolderView from "./FolderView"
import { RepoObject } from "./graphql"

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

  const objectQuery = useQuery(RepoObject, {
    variables: {
      name: APP_REPO_NAME,
      expression: `HEAD:${path}`,
    },
    fetchPolicy: "network-only",
  })
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
        <FolderView folderPath={path} entries={object.entries} />
      ) : object?.__typename === "Blob" ? (
        <Button onClick={() => {}}>Download</Button> //TODO: File preview component
      ) : (
        "Not found" //TODO: Not found page
      )}
    </Grid>
  )
}

export default Browse

export const runtime = "edge"
