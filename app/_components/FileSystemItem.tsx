import { FsItemTreeEntryFragment } from "@/gql/graphql"
import { Box, Flex, FlexProps } from "@chakra-ui/react"
import { faFile, faFolder } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FC, useEffect, useState } from "react"

interface Props extends FlexProps {
  treeEntry?: Partial<FsItemTreeEntryFragment>
  onOpen?: () => void
}

const FsItem: FC<Props> = ({ treeEntry, onOpen, ...flexProps }) => {
  const { name, object } = treeEntry ?? {}
  const type = object?.__typename

  const icon = type === "Tree" ? faFolder : faFile

  return (
    <Flex
      as="button"
      boxSize="9rem"
      direction="column"
      alignItems="center"
      gap="1"
      pt="7"
      px="2"
      _hover={{ backgroundColor: "gray.50" }}
      onClick={onOpen}
      {...flexProps}
    >
      <Box color="gray.700">
        <FontAwesomeIcon icon={icon} size="4x" />
      </Box>
      <Box
        fontSize="small"
        textAlign="center"
        noOfLines={2}
        overflowWrap="anywhere"
      >
        {name}
      </Box>
    </Flex>
  )
}

export default FsItem
