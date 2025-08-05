use std::process::Command;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// This function runs a Python script to create directories
#[tauri::command]
fn create_dir() -> String {
    // Run the python script and get output
    let output = Command::new("python")
        .arg("../../../Back/functions.py")
        // Pass the function
        .arg("create_dir")
        .output()
        .expect("Failed to execute command");

    if output.status.success() {
        String::from_utf8_lossy(&output.stdout).to_string()
    } else {
        String::from_utf8_lossy(&output.stderr).to_string()
    }
}

// This function runs a Python script to check and add games
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, create_dir])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
