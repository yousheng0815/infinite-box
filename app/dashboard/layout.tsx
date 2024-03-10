import { FC, PropsWithChildren } from "react"
import Sidebar from "./Sidebar"
import { Box, Grid } from "@chakra-ui/react"
import Topbar from "./Topbar"
import DashboardProvier from "./DashboardProvier"

const DashboardLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <DashboardProvier>
      <Grid
        templateColumns="16rem 1fr"
        templateRows="auto 1fr"
        h="100vh"
        background="subtle"
      >
        <Sidebar gridRow="1 / -1" background="gray.100" px="8" py="4" />
        <Topbar px="4" py="4" />
        <Box pb="4" px="4" overflowY="auto">
          {children}
        </Box>
      </Grid>
    </DashboardProvier>
  )
}

export default DashboardLayout
