
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
    token: "8f128f89c65414e0b5dc1ad18636dbddb53fd7b6",
    username: "lekeodewuyi"
  }


  export { queryFunc, githubData };