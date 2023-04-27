document.querySelector('[aria-label="More options"]').click() // doesn't work
Array.from(document.querySelectorAll('[role="menuitem"]')).find(e => Array.from(e.children).find(f => f.innerHTML === "Apply visual effects")).click()
