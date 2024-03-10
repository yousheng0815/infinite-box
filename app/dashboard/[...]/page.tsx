import { redirect } from "next/navigation"
import { FC } from "react"

const DashboardCatchAll: FC = () => {
  redirect("/dashboard")
}

export default DashboardCatchAll
