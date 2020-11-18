import {queryFunc, githubData} from './util/github_data.js';
import {isInViewport, relativeTime, appendChildFunc, appendStar, truncateText} from './util/helper.js';


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
document.addEventListener('scroll', function() {
    mainNavImage.style.opacity = isInViewport(mainAvatar) ? "0" : 1;
})

const hamburger = document.querySelector('.hamburger');
const dropDownNav = document.querySelector('.dropdown-nav');
hamburger.addEventListener('click', function(){
    dropDownNav.style.display = !(dropDownNav.style.display === "none") ? "none" : "flex";
})

openModal.forEach((btn) => {
    btn.addEventListener('click', function(){
        modal.classList.remove('hide');
    })
})

document.addEventListener('dblclick', function(){
    modal.classList.remove('hide');
})

closeModal.addEventListener('click', function(){
    modal.classList.add('hide');
    newUserName.value = "";
  
    if (checkbox.checked) {
        localStorage.setItem('dontShow', "true");
    } else {
        localStorage.setItem('dontShow', "false");
    }
})

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
        console.log(result);
  
        appendUserDetails(result)
  
        if (result.name !== null) {
            nowShowing.innerHTML = `Now showing: <span class="now-showing-name">${result.name}</span>'s profile`
        } else {
            nowShowing.innerHTML = `Now showing: <span class="now-showing-name">${result.login}</span>'s profile`
        }
        loader.classList.remove('inline-block');
    })
    .catch((error) => {
        if (username !== "lekeodewuyi") {
            retrieveData("lekeodewuyi");
        }
        console.log('hey');
        loader.classList.remove('inline-block');
        console.error(error.json());
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
    console.log("Im here y'all")

    let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    console.log(vw)

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
