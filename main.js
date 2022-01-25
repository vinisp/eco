const $navBarItems = document.querySelectorAll(".menuItem");
const $navBar = document.querySelector(".navBar");
const $cards = document.querySelector("#cards");
let opacity = false;

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.documentElement.scrollTop > 80) {
    for (let i = 0; i < $navBarItems.length; i++) {
      /* $navBarItems[i].style.opacity = "0.2"; */
    }
    opacity = true;
    console.log();
    $navBar.style.height = "40px";
    $navBar.style.opacity = "0.4";
  } else {
    for (let i = 0; i < $navBarItems.length; i++) {
      $navBarItems[i].style.opacity = "1";
    }
    $navBar.style.height = "80px";
    $navBar.style.opacity = "1";
  }
}

function isVisible(element) {
  let elementBox = element.getBoundingClientRect();
  let distanceTop = -450;

  if (elementBox.top - window.innerHeight < distanceTop) {
    return true;
  } else {
    return false;
  }
}

function scanDocument() {
  let sectionList = document.querySelectorAll(".hidden");
  sectionList.forEach(function (section) {
    section.classList.remove("hidden");
    section.classList.add("show");
  });
}

console.log($cards.getBoundingClientRect());

document.addEventListener("scroll", scanDocument);
