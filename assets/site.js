// Menu sur petit écran, et année du pied de page
const toggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("menu");
toggle.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
menu.addEventListener("click", e => {
  if (e.target.tagName === "A") { menu.classList.remove("open"); toggle.setAttribute("aria-expanded", false); }
});
document.querySelector("[data-year]").textContent = new Date().getFullYear();
