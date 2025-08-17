import { invoke } from "@tauri-apps/api/core";

let nameInputEl: HTMLInputElement | null;
let nameFormEl: HTMLFormElement | null;
let nameSectionEl: HTMLElement | null;
let appSectionEl: HTMLElement | null;
let userNameEl: HTMLElement | null;
let gameStatusEl: HTMLElement | null;
let addGamesSectionEl: HTMLElement | null;
let continueBtnEl: HTMLButtonElement | null;

// Show the main app section and hide the name input section
function showAppSection(name: string) {
  if (nameSectionEl && appSectionEl && userNameEl) {
    nameSectionEl.style.display = "none";
    appSectionEl.style.display = "block";
    userNameEl.textContent = name;
  }
}

// Show the name input section and hide the main app section
function showNameSection() {
  if (nameSectionEl && appSectionEl) {
    nameSectionEl.style.display = "block";
    appSectionEl.style.display = "none";
  }
}
// Show the add games section and hide the main app section
function showAddGamesSection() {
  if (addGamesSectionEl) {
    addGamesSectionEl.style.display = "block";
  }
  if (gameStatusEl) {
    gameStatusEl.textContent = "";
  }
}

// Hide the add games section
function hideAddGamesSection() {
  if (addGamesSectionEl) {
    addGamesSectionEl.style.display = "none";
  }
}

// Show the add games section and hide the main app section
window.addEventListener("DOMContentLoaded", () => {
  // Initialize elements
  nameInputEl = document.querySelector("#name-input");
  nameFormEl = document.querySelector("#name-form");
  nameSectionEl = document.querySelector("#name-section");
  appSectionEl = document.querySelector("#app-section");
  userNameEl = document.querySelector("#user-name");
  gameStatusEl = document.querySelector("#game-status");
  addGamesSectionEl = document.querySelector("#add-games-section");
  continueBtnEl = document.querySelector("#continue-btn");

  // Check if name is stored in localStorage
  const storedName = localStorage.getItem("userName");
  if (storedName) {
    showAppSection(storedName);
  } else {
    showNameSection();
  }

  // Handle name form submission
  nameFormEl?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (nameInputEl && nameInputEl.value.trim()) {
      // Save name to localStorage
      localStorage.setItem("userName", nameInputEl.value.trim());
      showAppSection(nameInputEl.value.trim());
    }
  });

  // Create directories for games
  document.querySelector("#create-dir-button")?.addEventListener("click", async () => {
    if (gameStatusEl) {
      gameStatusEl.textContent = "Creating directories...";
      const result = await invoke("create_dir");
      gameStatusEl.textContent = result as string;
      showAddGamesSection();

      // Hide the button after directories are created
      const createDirBtn = document.querySelector("#create-dir-button") as HTMLButtonElement | null;
      if (createDirBtn) {
        createDirBtn.style.display = "none";
      }
    }
  });

  // Handle continue button click
  continueBtnEl?.addEventListener("click", async () => {
    hideAddGamesSection();
    // Scan for games
    if (gameStatusEl) {
      gameStatusEl.textContent = "Checking games...";
      const result = await invoke("scan_games");
      // Parse and display game data
      try {
        const games = JSON.parse(result as string);
        if (Array.isArray(games) && games.length > 0) {
          gameStatusEl.innerHTML = games.map(game =>
            `<div>
              <strong>${game.console}:</strong> ${game.name}<br>
              <img src="${game.box_art}" alt="${game.name} box art" style="max-width:200px; border-radius:8px; margin:8px 0;">
            </div>`
          ).join("");
        } else {
          gameStatusEl.textContent = "No games found.";
        }
      } catch {
        gameStatusEl.textContent = "Error reading game data.";
      }
    }
  });
});
