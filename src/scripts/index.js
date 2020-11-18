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
