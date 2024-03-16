import { Box, BoxProps, Flex, Grid } from "@chakra-ui/react"
import { faCube } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { FC, forwardRef } from "react"

const Sidebar = forwardRef<HTMLDivElement, BoxProps>((props, ref) => (
  <Box ref={ref} px="8" py="4" background="gray.100" {...props}>
    <Link href="/dashboard/home">
      <Flex p="2" gap="3" alignItems="center" fontSize="lg" fontWeight="bold">
        <FontAwesomeIcon icon={faCube} size="lg" /> Infinite Box
      </Flex>
    </Link>
    <Grid mt="8" gap="2">
      <Link href="/dashboard/home">Home</Link>
      {/* <Link href="/dashboard/recent">Recent</Link>
      <Link href="/dashboard/shared">Shared</Link>
      <Link href="/dashboard/favorite">Favorite</Link>
      <Link href="/dashboard/trash">Trash</Link> */}
    </Grid>
  </Box>
))

export default Sidebar
