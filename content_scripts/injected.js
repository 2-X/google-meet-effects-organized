let DEBUG = false;
document.addEventListener('return_debug_mode', e => {DEBUG = e.detail.data;});
window.dispatchEvent(new CustomEvent('check_debug_mode', { detail: null }));

// append an iframe so we can re-enable console.log
// using its console.log
const frame = document.createElement('iframe');
document.body.appendChild(frame);

// if DEBUG, re-enable console.log as console.log
const welcome_message = 'Welcome to gmeet_effects_organized!';
if (DEBUG) {
    console.log = (...content) => {
        frame.contentWindow.console.log(...content);
    }
} else {
    console.log = () => {}
}

// print our welcome message regardless
console.log(welcome_message);

// re-inject if they change the page
let previous_url = null;
setInterval(() => {
    // get current url
    const current_url = document.location.href;

    // if the language changed, we know we just loaded the home page
    if (previous_url !== current_url) {
        inject_gmeet_effects_organized();
        previous_url = current_url;
    }
}, 100);

let stylesheet_loaded = false;
let the_extension_id = null;
// inject stylesheet, buttons, etc.
const inject = (extension_id) => {
    the_extension_id = extension_id;
    // inject stylesheet
    let stylesheet = document.createElement('LINK');
    stylesheet.setAttribute('rel', 'stylesheet')
    stylesheet.setAttribute('type', 'text/css')
    stylesheet.setAttribute('href', `${the_extension_id}/content_scripts/main.css`)
    document.body.appendChild(stylesheet)
    stylesheet.onload = () => {
        stylesheet_loaded = true;
    }
}

let eventListeners = [];
const remove_event_listeners = () => {
    console.log(`removing injected eventListeners: ${eventListeners}`)
    for (let e of eventListeners) {
        e['node'].removeEventListener(e['type'], e['func'], true)
    }
    eventListeners = [];
}

const inject_gmeet_effects_organized = () => {
    console.log(stylesheet_loaded, the_extension_id);
    const i = setInterval(() => {
        if (stylesheet_loaded && the_extension_id) {
            const filters_section_div = document.querySelector('[data-section-label="Filters"]')
            const new_effects_section_div = document.querySelector('[data-section-label="New"]')

            if (filters_section_div) {
                clearInterval(i);

                const filter_div_map = {}
                filters_section_div.style = "display: flex; flex-direction: column;"
                const all_children = Array.from(filters_section_div.children).concat(Array.from(new_effects_section_div?.children || []))

                // put the filter divs in a map so we can look them up later
                Array.from(all_children).filter(e => {
                    return e.tagName === "DIV";
                }).forEach(filter_div => {
                    filter_div_map[filter_div.querySelector('[role="tooltip"]').innerHTML] = filter_div;
                    // filter_div.remove()
                })

                const filter_group_map = {
                    "full scenes": [
                        "Cute dragon",
                        "Fries",
                        "Fuzzy cat",
                        "Lifelike dog",
                        "Office bunny",
                        "Ramadan moon",
                    ],
                    "“annoying orange”-esque": [
                        "Alien in a spaceship",
                        "Spooky cat",
                        "Strawberry head",
                    ],
                    "mask + background": [
                        "Astronaut",
                        "Flower bouquet",
                        "Heart in clouds",
                        "Turkey",
                    ],
                    "3d “masks”": [
                        "Buccaneer",
                        "Cat glasses",
                        "Cyberpunk helmet",
                        "Elephant",
                        "Log head",
                        "Mustache cowboy",
                        "Rainbow tiger",
                        "Ready for the beach",
                    ],
                    "sitting on your head": [
                        "Amusement park",
                        "Cat on head. Smile or look angry.",
                        "Goodnight bear",
                        "Graduation cap",
                        "I have an idea. Open your mouth to light the bulb.",
                        "Jungle frog",
                        "Octopus",
                    ],
                    "snapchat-filtery": [
                        "Cherry blossoms",
                        "Cool sunglasses",
                        "Cupid panda",
                        "Fireflies",
                        "Jellyfish",
                        "Pride rainbow heart",
                        "Silent-disco hat",
                    ],
                }

                for (let pair of Object.entries(filter_group_map)) {
                    const section_name = pair[0]
                    const matching_filter_names = pair[1]

                    const section_div = document.createElement("div")
                    section_div.style = "padding-left: 10px;"
                    const section_filters_div = document.createElement("div")
                    section_filters_div.style = "display: flex; flex-direction: row; flex-wrap: wrap;"
        
                    const section_div_header = document.createElement("h3")
                    section_div_header.innerText = section_name
                    section_div.append(section_div_header)
                    section_div.append(section_filters_div)
        
                    for (let matching_filter_name of matching_filter_names) {
                        const matching_filter_div = filter_div_map[matching_filter_name]
                        if (matching_filter_div === undefined) {
                            console.log(`${matching_filter_name} was not found in the 'filter_div_map'`)
                        } else {
                            section_filters_div.append(matching_filter_div)
                        }
                    }
        
                    filters_section_div.append(section_div)
                }
            }        
        }
    }, 100)
}

// get chrome extension's ID
document.addEventListener('return_extension_id', e => {
    const extension_id = `chrome-extension://${e.detail.data}`;

    // inject when we have the extension's ID
    inject(extension_id);
});

// chrome extension's ID
window.dispatchEvent(
    new CustomEvent('check_extension_id', { detail: null })
);


// block all right-clicking the website performs
// save the position when the user holds right click down the first time
// when they release it, or if they left-click a square, send the pointerdown for the previous coords and the pointerup for the current coords
