import { FsItemTreeEntryFragment } from "@/gql/graphql"
import {
  Box,
  Flex,
  FlexProps,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuItemProps,
  MenuList,
} from "@chakra-ui/react"
import { faEllipsis, faFile, faFolder } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FC, Fragment } from "react"
import Loading from "./Loading"

type Option = MenuItemProps

interface Props extends FlexProps {
  treeEntry?: Partial<FsItemTreeEntryFragment>
  optionGroups?: Option[][]
  isLoading?: boolean
  onOpen?: () => void
}

const FsItem: FC<Props> = ({
  treeEntry,
  optionGroups,
  isLoading,
  onOpen,
  ...flexProps
}) => {
  const { name, object } = treeEntry ?? {}
  const type = object?.__typename

  const icon = type === "Tree" ? faFolder : faFile

  return (
    <Box position="relative">
      <Flex
        cursor="pointer"
        position="relative"
        boxSize="9rem"
        direction="column"
        alignItems="center"
        gap="1"
        pt="7"
        px="2"
        opacity={isLoading ? 0.6 : undefined}
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
        {!!optionGroups?.length && (
          <Menu computePositionOnMount>
            <MenuButton
              as={IconButton}
              position="absolute"
              top="0"
              right="0"
              size="sm"
              borderRadius="50%"
              variant="ghost"
              margin="2"
              aria-label="Option menu"
              icon={<FontAwesomeIcon icon={faEllipsis} />}
              onClick={(e) => e.stopPropagation()}
            />
            <MenuList onClick={(e) => e.stopPropagation()}>
              {optionGroups.map((optionGroup, index, array) => (
                <Fragment key={index}>
                  {optionGroup.map((optionProps, index) => (
                    <MenuItem key={index} {...optionProps} />
                  ))}
                  {index < array.length - 1 && <MenuDivider />}
                </Fragment>
              ))}
            </MenuList>
          </Menu>
        )}
      </Flex>
      {isLoading && <Loading position="absolute" inset="0" size="sm" />}
    </Box>
  )
}

export default FsItem
