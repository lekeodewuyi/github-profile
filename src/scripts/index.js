import {queryFunc, githubData} from './util/github_data.js';
import {isInViewport, relativeTime, appendChildFunc, appendStar, truncateText, updatePageIcon} from './util/helper.js';


const checkbox = document.querySelector('.checkbox');
const loader = document.querySelector('.loader');

const modal = document.querySelector('.modal');
const openModal = document.querySelectorAll('.open-modal');
const closeModal = document.querySelector('.modal-close-btn');
const newUserName = document.querySelector('.modal-input');
const nowShowing = document.querySelector('.modal-now-showing');


const checkPrompStatus = () => {
    const dontShow = localStorage.getItem('dontShow');
    if (dontShow === "true") {
        modal.classList.add('hide');
        checkbox.checked = true;
    } else {
        modal.classList.remove('hide');
    }
}

checkPrompStatus()

const mainNavImage = document.querySelector('.main-nav-image');
const mainAvatar = document.querySelector('.main-avatar');
const maxUserName = document.querySelector('.max-username');
document.addEventListener('scroll', function() {
    mainNavImage.style.opacity = isInViewport(mainAvatar) ? "0" : "1";
    maxUserName.style.opacity = isInViewport(mainAvatar) ? "1" : "0";
})

const hamburger = document.querySelector('.hamburger');
const dropDownNav = document.querySelector('.dropdown-nav');
hamburger.addEventListener('click', function(){
    dropDownNav.style.display = !(dropDownNav.style.display === "none") ? "none" : "flex";
})

const updateDropDownNav = () => {
    let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    if (vw > 768 && dropDownNav.style.display === "flex") {
        dropDownNav.style.display = "none";
    }
}


openModal.forEach((btn) => {
    btn.addEventListener('click', function(){
        modal.classList.remove('hide');
    })
})

document.addEventListener('dblclick', function(){
    modal.classList.remove('hide');
})

const closePrompt = () => {
    modal.classList.add('hide');
    newUserName.value = "";
  
    if (checkbox.checked) {
        localStorage.setItem('dontShow', "true");
    } else {
        localStorage.setItem('dontShow', "false");
    }
}

closeModal.addEventListener('click', function(){
    closePrompt();
})

document.addEventListener('click', function(e){
    const target = e.target;
    if (!modal.classList.contains('hide')) {
        if (!modal.contains(target)) {
            closePrompt()
        }
    }
}, true)

const retrieveData = (username) => {
  
    loader.classList.add('inline-block');
    const query = queryFunc(username.trim());
  
    fetch('https://api.github.com/graphql', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${githubData.token}`
        },
        body: JSON.stringify({query})
    })
    .then(response => response.json()
    )
    .then((data) => {
        const result = data.data.user;
  
        appendUserDetails(result)
  
        if (result.name !== null) {
            nowShowing.innerHTML = `Now showing: <span class="now-showing-name">${result.name}</span>'s profile`
            document.title = `GitHub Profile - ${result.name}`
        } else {
            nowShowing.innerHTML = `Now showing: <span class="now-showing-name">${result.login}</span>'s profile`
            document.title = `GitHub Profile - ${result.login}`
        }
        loader.classList.remove('inline-block');
    })
    .catch((error) => {
        if (username !== "lekeodewuyi") {
            retrieveData("lekeodewuyi");
        }
        loader.classList.remove('inline-block');
        console.error(error);
    })
  
  }
  
retrieveData(githubData.username);

newUserName.addEventListener('keyup', function(){
    retrieveData(newUserName.value);
})

newUserName.addEventListener('blur', function(){
    retrieveData(newUserName.value);
})


let status = {
    emojiHTML: null,
    message: null
  }
  
  
const updateStatus = (data) => {
    status = {
        emojiHTML: data.emojiHTML,
        message: data.message
    }
}
  
const setStatusIcon = document.querySelectorAll('.set-status-icon');
const setStatusText = document.querySelectorAll('.set-status-text');
  
const appendStatus = (data) => {
    data = status;

    let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

    if (data.emojiHTML !==null) {
        setStatusIcon.forEach((icon) => {
            icon.innerHTML = data.emojiHTML;
        })
    } else {
        setStatusIcon.forEach((icon) => {
            icon.innerHTML = `<svg viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zM5 8a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zM5.32 9.636a.75.75 0 011.038.175l.007.009c.103.118.22.222.35.31.264.178.683.37 1.285.37.602 0 1.02-.192 1.285-.371.13-.088.247-.192.35-.31l.007-.008a.75.75 0 111.222.87l-.614-.431c.614.43.614.431.613.431v.001l-.001.002-.002.003-.005.007-.014.019a1.984 1.984 0 01-.184.213c-.16.166-.338.316-.53.445-.63.418-1.37.638-2.127.629-.946 0-1.652-.308-2.126-.63a3.32 3.32 0 01-.715-.657l-.014-.02-.005-.006-.002-.003v-.002h-.001l.613-.432-.614.43a.75.75 0 01.183-1.044h.001z"></path></svg>`;
        })
    }

    if (data.message !==null) {
        setStatusText.forEach((text) => {
            text.innerText = truncateText(data.message, 42);
        if (vw > 768) {
            text.innerText = truncateText(data.message, 10);
        }
    })
    } else {
        setStatusText.forEach((text) => {
            text.innerText = "Set status";
        })
    }
}

window.addEventListener('resize', () => {
    appendStatus();
    updateDropDownNav();
}, false);

window.addEventListener('orientationchange', () => {
    appendStatus;
    updateDropDownNav;
}, false);


const appendUserDetails = (data) => {

    const repositoryCount = document.querySelectorAll('.repositories-count');
    repositoryCount.forEach((count) => {
        count.innerText = data.repositories.totalCount;
    });
  
    const userAvatar = document.querySelectorAll('.user-avatar');
    userAvatar.forEach(img => {
        img.src = data.avatarUrl;
    })

    updatePageIcon(data.avatarUrl);
  
    if (data.status === null) {
        status = {
            emojiHTML: null,
            message: null
        }
    }
  
    if ( data.status !== null) {
        updateStatus(data.status);
    }
  
    appendStatus(status);
  
    const profileName = document.querySelectorAll('.profile-name');
    profileName.forEach((name) => {
        name.innerText = data.name;
    });
  
    const profileUserName = document.querySelectorAll('.profile-username');
    profileUserName.forEach((username) => {
        username.innerText = data.login;
    });
  
    const profileBio = document.querySelectorAll('.profile-bio');
    profileBio.forEach((bio) => {
        bio.innerText = data.bio;
    })
  
    const followerCount = document.querySelector('.follower-count');
    followerCount.innerText = data.followers.totalCount;
  
    const followingCount = document.querySelector('.following-count');
    followingCount.innerText = data.following.totalCount;
  
    const starCount = document.querySelector('.star-count');
    starCount.innerText = data.starredRepositories.totalCount;
  
    const profileWebsite = document.querySelectorAll('.profile-user-website');
    profileWebsite.forEach((site) => {
        site.innerText = data.websiteUrl;
        site.setAttribute('href', data.websiteUrl);
    });
  
  
  
    const repositories = data.repositories.edges;

  
    const repoList = document.querySelector('.repository-list');
  
    repoList.innerHTML = "";
  
    for (let i = 0; i < repositories.length; i++) {
  
        const repo = repositories[i].node
  
        const repoItem = document.createElement('div');
        repoItem.classList.add('repository-item', 'flex', 'border-bottom');
  
        const repoDetails = document.createElement('div');
        repoDetails.classList.add('repository-item-left-container', 'relative');
  
        const repoNameAndPrivacy = document.createElement('div');
        repoNameAndPrivacy.classList.add('repository-name-and-visibility', 'center-align');
  
        const repoName = document.createElement('p');
        repoName.classList.add('repository-name');
        repoName.innerHTML = `<a href=https://github.com/${data.login}/${repo.name}>${repo.name}</a>`;
  
        const repoPrivacy = document.createElement('span');
        repoPrivacy.innerText = "Private";
  
        if (repo.isPrivate) {
            repoPrivacy.classList.add('repository-visibility')
            repoName.innerHTML = `<a href=https://github.com/${data.login}/${repo.name}>${repo.name}</a> <span class="repository-visibility">Private</span>`
        } else {
            repoPrivacy.classList.add('hide');
        }
        appendChildFunc(repoNameAndPrivacy, [repoName]);
  
      
  
        const forkedFrom = document.createElement('p');
        if (repo.isFork) {
            forkedFrom.innerHTML = `Forked from <a class="muted-a" href=https://github.com/${repo.parent.nameWithOwner}>${repo.parent.nameWithOwner}</a>`;
            forkedFrom.classList.add('forked-from');
        }
  
        const repoDescription = document.createElement('p');
        if (repo.descriptionHTML !== null) {
            repoDescription.innerHTML = repo.descriptionHTML;
            repoDescription.classList.add('repository-description');
        }
  
  
        const repoMetaDetails = document.createElement('div');
        repoMetaDetails.classList.add('repository-meta-details', 'flex');
  
        const repoLanguageContainer = document.createElement('div');
        repoLanguageContainer.classList.add('language-container', 'flex');
  
        if (repo.primaryLanguage !== null) {
        
            const repoColor = document.createElement('div');
            repoColor.classList.add('lang-color');
            repoColor.style.backgroundColor = repo.primaryLanguage.color;
    
            const repoLang = document.createElement('div');
            repoLang.classList.add('text');
            repoLang.innerText = repo.primaryLanguage.name;
  
  
            appendChildFunc(repoLanguageContainer, [repoColor, repoLang]);
            repoMetaDetails.appendChild(repoLanguageContainer);
        }
  
        if (repo.isFork) {
  
            const forkContainer = document.createElement('div');
            forkContainer.classList.add('fork-container', 'muted-a', 'flex');
  
            const forkIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            forkIcon.classList.add('fork-icon');
            forkIcon.setAttribute('viewBox', '0 0 16 16');
            forkIcon.innerHTML = `<path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>`;
  
            const forkCount = document.createElement('div');
            forkCount.classList.add('fork-count');
            forkCount.innerText = repo.parent.forkCount;
  
            appendChildFunc(forkContainer, [forkIcon, forkCount]);
            repoMetaDetails.appendChild(forkContainer);
        }
  
        const lastUpdated = document.createElement('div');
        lastUpdated.classList.add('time-updated');
  
        const dateNow = Date.now();
        const dateUpdated = !repo.isFork ? new Date (repo.updatedAt) : new Date (repo.parent.updatedAt);
        lastUpdated.innerText = `${relativeTime(dateNow, dateUpdated)}`;
    
        repoMetaDetails.appendChild(lastUpdated);
    
    
        const repoStarBtn = document.createElement('button');
        repoStarBtn.classList.add('repository-star-btn', 'btn', 'flex', 'center-align');
      
        const starIcon = document.createElement('div');
        starIcon.classList.add('star-icon');
    
        const starIconFilled = document.createElement('div');
        starIconFilled.classList.add('filled', 'hide');
        starIconFilled.innerHTML = `<svg viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"></path></svg>`;
    
        const starIconUnfilled = document.createElement('div');
        starIconUnfilled.classList.add('unfilled');
        starIconUnfilled.innerHTML = `<svg height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>`
    
        const starText = document.createElement('p');
        starText.classList.add('star-status');
        starText.innerText = 'Star';
  
  
        appendChildFunc(starIcon, [starIconFilled, starIconUnfilled]);
    
        appendChildFunc(repoStarBtn, [starIcon, starText]);
    
    
        appendChildFunc(repoDetails, [repoNameAndPrivacy, forkedFrom, repoDescription, repoMetaDetails]);
        appendChildFunc(repoItem, [repoDetails, repoStarBtn]);
        repoList.appendChild(repoItem);
    
    }
    appendStar();
    
}
