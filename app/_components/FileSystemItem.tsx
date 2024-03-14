import { FsItemTreeEntryFragment, RepositoryVisibility } from "@/gql/graphql"
import { gql, useMutation, useQuery } from "@apollo/client"
import { Box, Flex, Grid } from "@chakra-ui/react"
import { FC, MouseEventHandler, useContext, useEffect, useState } from "react"
import { GithubContext } from "../GlobalProvier"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFile, faFolder } from "@fortawesome/free-solid-svg-icons"

interface Props extends FsItemTreeEntryFragment {
  onOpen?: () => void
}

const FsItem: FC<Props> = ({ name, oid, path, size, object, onOpen }) => {
  const type = object?.__typename

  const [isSelected, setIsSelected] = useState(false)
  useEffect(() => {
    const handleClick = () => setIsSelected(false)
    window.addEventListener("click", handleClick, { capture: true })

    return () =>
      window.removeEventListener("click", handleClick, { capture: true })
  }, [])

  if (type !== "Blob" && type !== "Tree") return null

  const icon = type === "Blob" ? faFile : faFolder

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
