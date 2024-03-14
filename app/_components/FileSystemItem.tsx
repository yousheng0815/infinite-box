import { FsItemTreeEntryFragment } from "@/gql/graphql"
import { gql } from "@apollo/client"
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

  const [isSelected, setIsSelected] = useState(false)
  useEffect(() => {
    const handleClick = () => setIsSelected(false)
    window.addEventListener("click", handleClick, { capture: true })

    return () =>
      window.removeEventListener("click", handleClick, { capture: true })
  }, [])

  const icon = type === "Tree" ? faFolder : faFile

  return (
    <Flex
      boxSize="8rem"
      direction="column"
      alignItems="center"
      gap="1"
      pt="4"
      border="1px"
      borderColor={isSelected ? "gray.200" : "transparent"}
      _hover={{ backgroundColor: "gray.50" }}
      onClick={() => setIsSelected(true)}
      onDoubleClick={onOpen}
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

export default FsItem
