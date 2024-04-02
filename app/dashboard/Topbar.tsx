"use client"

import {
  BoxProps,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { usePathname } from "next/navigation"
import { forwardRef, useContext, useEffect } from "react"
import { dashboardContext } from "./DashboardProvier"
import LogoutButton from "./LogoutButton"

const Topbar = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  const { search, setSearch } = useContext(dashboardContext)

  const pathname = usePathname()
  useEffect(() => {
    setSearch("")
  }, [pathname])

  return (
    <Flex ref={ref} {...props} gap="4">
      <InputGroup size="md">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
        />
        {search && (
          <InputRightElement>
            <IconButton
              size="xs"
              onClick={() => setSearch("")}
              aria-label="clear"
              icon={<FontAwesomeIcon icon={faXmark} />}
            />
          </InputRightElement>
        )}
      </InputGroup>
      <LogoutButton />
    </Flex>
  )
})

export default Topbar
