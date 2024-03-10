import { Box, BoxProps, Grid, useColorModeValue } from "@chakra-ui/react"
import Link from "next/link"
import React, { FC } from "react"

const Sidebar: FC<BoxProps> = (props) => {
  return (
    <Box {...props}>
      <Box p="2" mb="3">
        Logo
      </Box>
      <Grid gap="2">
        <Link href="/dashboard">Home</Link>
        <Link href="/dashboard/recent">Recent</Link>
        <Link href="/dashboard/shared">Shared</Link>
        <Link href="/dashboard/favorite">Favorite</Link>
        <Link href="/dashboard/trash">Trash</Link>
      </Grid>
    </Box>
  )
}

export default Sidebar
