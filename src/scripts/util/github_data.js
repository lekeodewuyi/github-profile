
const queryFunc = (username) => {
    return `query{
      user(login: "${username}") {
        id
        avatarUrl
        bio
        createdAt
        followers {
            totalCount
        }
        following {
            totalCount
        }
        login
        name
        starredRepositories {
            totalCount
        }
        status {
          emojiHTML
          message
        }
        websiteUrl
        repositories(orderBy: {field: UPDATED_AT, direction: DESC}, first: 20) {
            totalCount
            edges {
            node {
                descriptionHTML
                forkCount
                forks {
                totalCount
                }
                isFork
                parent {
                  nameWithOwner
                  forkCount
                  updatedAt
                }
                isPrivate
                name
                nameWithOwner
                primaryLanguage {
                color
                name
                }
                updatedAt
            }
            }
            nodes {
            createdAt
            }
        }
      }
    }`
  }
  

  // This access token has a user data read only permission (read:user - can only read my publicly available GitHub data) so it's safe to use on the client-side

  // Ideally, I would use it on the backend and implement a Node.js cloud function to call the GitHub GraphQl api but wans't sure if you'd regard Node.js as a JS frmaework

  // Also I wanted everything to happen in the forntend/ all in the browser
  const githubData = {
    token: "45fe2b2a0f0cf96525ad7da04aa46d9c323b192a",
    username: "lekeodewuyi"
  }


  export { queryFunc, githubData };