const $navBarItems = document.querySelectorAll(".menuItem");
const $navBar = document.querySelector(".navBar");

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.documentElement.scrollTop > 80) {
    for (let i = 0; i < $navBarItems.length; i++) {
      $navBarItems[i].style.opacity = "0.2";
    }
    $navBar.style.height = "40px";
  } else {
    for (let i = 0; i < $navBarItems.length; i++) {
      $navBarItems[i].style.opacity = "1";
    }
    $navBar.style.height = "80px";
  }
}

console.log($navBar);
