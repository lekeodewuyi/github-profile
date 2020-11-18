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

