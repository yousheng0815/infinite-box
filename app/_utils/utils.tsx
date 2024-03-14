export const APP_REPO_NAME = ".infinite-box"

// GitHub GraphQL api doesn't support auto_init option
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

export const downloadRepoFile = async (
  accessToken: string,
  owner: string,
  repo: string,
  path: string
) => {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${accessToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  )
  const responseJson = await response.json()

  if (!response.ok) {
    throw new Error(responseJson.message)
  }

  download(responseJson.download_url, responseJson.name)
}

export const download = async (url: string, name: string) => {
  const anchorElement = document.createElement("a")
  anchorElement.href = url
  anchorElement.download = name
  document.body.appendChild(anchorElement)
  anchorElement.click()
  document.body.removeChild(anchorElement)
}

export const getBase64 = async (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader?.result
      if (!result) return reject("FileReader result is null")

      if (typeof result === "string") return resolve(result.split(",")[1])

      const uint8Array = Array.from(new Uint8Array(result))
      resolve(btoa(String.fromCharCode.apply(null, uint8Array)))
    }
    reader.readAsDataURL(file)
  })
}
