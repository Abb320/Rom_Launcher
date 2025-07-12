import { invoke } from "@tauri-apps/api/core";

let nameInputEl: HTMLInputElement | null;
let nameFormEl: HTMLFormElement | null;
let nameSectionEl: HTMLElement | null;
let appSectionEl: HTMLElement | null;
let userNameEl: HTMLElement | null;
let gameStatusEl: HTMLElement | null;

function showAppSection(name: string) {
  if (nameSectionEl && appSectionEl && userNameEl) {
    nameSectionEl.style.display = "none";
    appSectionEl.style.display = "block";
    userNameEl.textContent = name;
  }
}

function showNameSection() {
  if (nameSectionEl && appSectionEl) {
    nameSectionEl.style.display = "block";
    appSectionEl.style.display = "none";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  nameInputEl = document.querySelector("#name-input");
  nameFormEl = document.querySelector("#name-form");
  nameSectionEl = document.querySelector("#name-section");
  appSectionEl = document.querySelector("#app-section");
  userNameEl = document.querySelector("#user-name");
  gameStatusEl = document.querySelector("#game-status");

  const storedName = localStorage.getItem("userName");
  if (storedName) {
    showAppSection(storedName);
  } else {
    showNameSection();
  }

  nameFormEl?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (nameInputEl && nameInputEl.value.trim()) {
      localStorage.setItem("userName", nameInputEl.value.trim());
      showAppSection(nameInputEl.value.trim());
    }
  });

  document.querySelector("#check-games-btn")?.addEventListener("click", async () => {
    if (gameStatusEl) {
      gameStatusEl.textContent = "Checking for games...";
      const result = await invoke("check_and_add_games");
      gameStatusEl.textContent = result as string;
    }
  });
});
