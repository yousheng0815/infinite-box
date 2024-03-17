"use client"

import {
  Box,
  Fade,
  Flex,
  Grid,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { usePathname } from "next/navigation"
import { FC, PropsWithChildren, useEffect, useState } from "react"
import DashboardProvier from "./DashboardProvier"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import dynamic from "next/dynamic"

const NAVBAR_WIDTH = "16rem"

type Layout = "mobile" | "desktop"

const DashboardLayout: FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname()

  const layout = useBreakpointValue<Layout>({ base: "mobile", md: "desktop" })

  const [isMobileSidebarVisible, setIsMobileSidebarVisible] = useState(false)
  useEffect(() => setIsMobileSidebarVisible(false), [pathname])

  return (
    <DashboardProvier>
      {layout === "mobile" ? (
        <Box
          overflowX="hidden"
          onKeyDown={(e) => {
            if (e.code === "Escape") setIsMobileSidebarVisible(false)
          }}
        >
          <Flex
            h="100dvh"
            width={`calc(${NAVBAR_WIDTH} + 100%)`}
            ml={isMobileSidebarVisible ? "0" : `-${NAVBAR_WIDTH}`}
            transition="200ms"
          >
            <Sidebar w={NAVBAR_WIDTH} />
            <Grid
              flex="1"
              position="relative"
              templateRows="auto 1fr"
              background="subtle"
            >
              <Flex alignItems="center" width="full" gap="4" p="4">
                <IconButton
                  aria-label="Menu"
                  icon={<FontAwesomeIcon height="1rem" icon={faBars} />}
                  onClick={() => setIsMobileSidebarVisible((x) => !x)}
                />
                <Topbar flex="1" />
              </Flex>
              <Box p="4" overflowY="auto">
                {children}
              </Box>
              <Fade in={isMobileSidebarVisible} unmountOnExit>
                <Box
                  position="absolute"
                  background="blackAlpha.600"
                  left="0"
                  top="0"
                  boxSize="full"
                  onClick={() => setIsMobileSidebarVisible(false)}
                />
              </Fade>
            </Grid>
          </Flex>
        </Box>
      ) : (
        <Grid
          templateColumns="16rem 1fr"
          templateRows="auto 1fr"
          h="100dvh"
          background="subtle"
        >
          <Sidebar gridRow="1 / -1" />
          <Topbar px="4" py="4" />
          <Box p="4" overflowY="auto">
            {children}
          </Box>
        </Grid>
      )}
    </DashboardProvier>
  )
}

export default dynamic(() => Promise.resolve(DashboardLayout), { ssr: false })
