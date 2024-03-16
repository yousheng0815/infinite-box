import { Flex } from "@chakra-ui/react"
import LoginButton from "./LoginButton"

export default function Home() {
  return (
    <Flex inset="0" alignItems="center" justifyContent="center" h="100dvh">
      <LoginButton />
    </Flex>
  )
}
