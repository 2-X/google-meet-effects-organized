const interval = setInterval(() => {
    const filters_section_div = document.querySelector('[data-section-label="Filters"]')

    if (filters_section_div) {
        clearInterval(interval);

        const filter_div_map = {}

        filters_section_div.style = "display: flex; flex-direction: column;"

        // put the filter divs in a map so we can look them up later
        Array.from(filters_section_div.children).filter(e => {
            return e.tagName === "DIV";
        }).forEach(filter_div => {
            filter_div_map[filter_div.querySelector('[role="tooltip"]').innerHTML] = filter_div;
            // filter_div.remove()
        })

        const filter_group_map = {
            "full scenes": [
                "Office bunny",
                "Ramadan moon",
                "Fries",
            ],
            "“annoying orange”-esque": [
                "Spooky cat",
                "Alien in a spaceship",
                "Strawberry head",
            ],
            "face replacements": [
                "Cat",
                "Cyclops",
                "Dinosaur",
                "Dog",
                "Fish",
                "Flower",
                "Robot",
            ],
            "mask + background": [
                "Astronaut",
                "Flower bouquet",
                "Heart in clouds",
                "Turkey",
            ],
            "3d “masks”": [
                "Log head",
                "Cyberpunk helmet",
                "Cat glasses",
                "Elephant",
                "Buccaneer",
                "Rainbow tiger",
            ],
            "sitting on your head": [
                "Cat on head. Smile or look angry.",
                "I have an idea. Open your mouth to light the bulb.",
                "Amusement park",
                "Goodnight bear",
                "Graduation cap",
                "Jungle frog",
                "Octopus",
            ],
            "snapchat-filtery": [
                "Cherry blossoms",
                "Cupid panda",
                "Jellyfish",
                "Fireflies",
                "Cool sunglasses",
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
})

