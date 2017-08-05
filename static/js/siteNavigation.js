function makeDropDown(menuName) {
    const menu = document.getElementById(menuName);
    menu.classList.toggle("responsive");
}

document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("responsive-nav-button");
  menu.addEventListener("click", () => {
    makeDropDown("topnav");
  });
});
