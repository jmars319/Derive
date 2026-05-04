use serde::Serialize;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct DesktopShellStatus {
    product_name: &'static str,
    mode: &'static str,
    native_surface: &'static str,
}

#[tauri::command]
fn load_shell_status() -> DesktopShellStatus {
    DesktopShellStatus {
        product_name: "tenra Derive",
        mode: "desktop-shell",
        native_surface: "Tauri shell is wired for local launch and future native workflows.",
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![load_shell_status])
        .run(tauri::generate_context!())
        .expect("error while running tenra Derive desktop");
}
