var enabled = false;

const update_slider = (node_id, text_id, enabled_text, disabled_text, value) => {
    const input_switch = document.getElementById(node_id);
    const text_elem = document.getElementById(text_id);

    if (value) {
        text_elem.innerText = enabled_text;
        input_switch.checked = true;
    } else {
        text_elem.innerText = disabled_text;
        input_switch.checked = false;
    }
}

const update_enabled_slider = (value) => {
    update_slider(
        "toggle-enabled-input", "toggle-enabled-text",
        "Enabled\n(Reloads Meet)", "Disabled\n(Reloads Meet)",
        value,
    );
}

const reload_all_tabs = () => {
    chrome.windows.getAll({
        populate: true,
        windowTypes: ['normal', 'panel', 'popup'],
    }, (windows) => {
        windows.forEach((window) => {
            window.tabs.forEach((tab) => {
                if (tab.url.includes("meet.google.com")) {
                    chrome.tabs.reload(tab.id);
                }
            });
        });
    });
}

const toggle_extension_enabled = () => {
    enabled = !enabled;
    chrome.storage.local.set({"gmeet_effects_organized_enabled": enabled});
    update_enabled_slider(enabled);
    reload_all_tabs();
}

const send_event = (actionType) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: actionType});  
    });
}


const render_content = () => {
    // get content div
    let content_div = document.getElementById("content");

    content_div.innerHTML = `
        <div class="slider-container content-row">
            <label class="gmeet_effects_organized-switch">
                <input id="toggle-enabled-input" type="checkbox">
                <span class="gmeet_effects_organized-slider"></span>
            </label>
            <div id="toggle-enabled-text">Disabled</div>
        </div>
    `

    document.getElementById("toggle-enabled-input").onclick = toggle_extension_enabled;
    update_enabled_slider(enabled);
}

// ON LOAD
document.addEventListener("DOMContentLoaded", () => {
    // load if the extension was enabled from the cache
    chrome.storage.local.get(
        "gmeet_effects_organized_enabled",
        (response) => {
            let gmeet_effects_organized_enabled = response["gmeet_effects_organized_enabled"];
            enabled = Boolean(gmeet_effects_organized_enabled);
            render_content();
        }
    );
});
