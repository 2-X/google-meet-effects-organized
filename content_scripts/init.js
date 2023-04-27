// // function for injecting a file as a script so we can use it
const injectScript = (fileName) => {
    // append the content script as a script element to the page
    // so that it has proper permissions to modify video elements
    let th = document.getElementsByTagName('body')[0];
    let s = document.createElement('script');
    s.setAttribute('type', 'module');

    // set the source attribute for the injected script
    s.setAttribute('src', `chrome-extension://${chrome.runtime.id}/${fileName}`);
    th.appendChild(s);
}

const send_custom_event = (event_name, data=null) => {
    var event = document.createEvent("CustomEvent")
    event.initCustomEvent(event_name, true, true, {"data": data});
    document.dispatchEvent(event);
}

// only inject our script if the extension is enabled
chrome.storage.local.get(
    "gmeet_effects_organized_enabled",
    (response) => {
        gmeet_effects_organized_enabled = response["gmeet_effects_organized_enabled"]
        if (gmeet_effects_organized_enabled) {
            // inject our web accessible resource into the page
            // so it can access the properties of web elements that we need.
            // idk why you have to inject it for this but you do
            injectScript("content_scripts/injected.js")            
        }
    }
);

// when the extension asks for the id, give it!
window.addEventListener("get_extension_id", () => {
    send_custom_event("extension_id", chrome.runtime.id);
});
