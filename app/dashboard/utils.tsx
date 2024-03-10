export const APP_REPO_NAME = ".infinite-box"

// GitHub GraphQL api doesn't seem to have auto_init option
export const createAppRepo = async (accessToken: string) => {
  const response = await fetch("https://api.github.com/user/repos", {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: APP_REPO_NAME,
      private: true,
      auto_init: true,
    }),
  })
  if (!response.ok) {
    const responseJson = await response.json()
    throw new Error(responseJson.message)
  }
}
