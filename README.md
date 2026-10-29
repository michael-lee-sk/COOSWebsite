# COOS Website

A static welcome website for the Church of Our Saviour (COOS) in Singapore. It is built with HTML, CSS, and vanilla JavaScript; there is no build step or package installation.

## Launch the website

The shared navbar is loaded from an HTML partial with JavaScript. Use Live Server or a local HTTP server; opening the files directly with `file://` will show only the basic fallback navigation.

### Run a local web server

1. Open a terminal in this project folder.
2. Start Python's built-in web server:

	```powershell
	py -m http.server 8000
	```

	If `py` is not available, try `python -m http.server 8000`.
3. Visit [http://localhost:8000/html/](http://localhost:8000/html/) in your browser or can open the site with Live Server.
4. Stop the server with `Ctrl+C` in the terminal.

You can also open this folder in VS Code and use the Live Server extension, if installed.

An internet connection is needed for externally hosted fonts, images, maps, and YouTube content. The site itself is static and does not require a backend.

## Features

- **Welcome page:** introductory hero, calls to action, and a scroll-driven section that changes its image and story as you scroll.
- **Navigation:** desktop dropdown menus and a mobile menu drawer with expandable sections; press `Escape` to close open menus.
- **Plan a visit:** service schedules for Margaret Drive and Jurong, embedded maps, and links to directions.
- **Watch online:** link to COOS's YouTube channel for the livestream.
- **What's on and messages:** event and recent-sermon listings.
- **Ministry categories:** children, youth, adult, and Filipino ministry information in a two-column grid.
- **Cookie choice:** Accept and Decline both dismiss the banner and save the choice in browser storage, so it remains dismissed on later visits in that browser.
- **Contact links:** phone links and in-page navigation to key sections.

## Project files

- `html/` — `index.html`, `newcomer.html`, and `partials/navbar.html` (shared navigation markup)
- `css/styles.css` — layout, responsive styling, and visual design
- `js/navbar.js` ? loads the shared navbar and handles desktop/mobile navigation on both pages
- `css/newcomer.css` ? newcomer page styles
- `js/script.js` — menu behavior, scroll storytelling, ministry scrolling, and cookie-choice storage
- `images/coos-logo.png` — COOS logo used by the welcome page

Some menu items, event cards, and footer links currently point to sections on this page or act as placeholders rather than opening separate pages or submitting forms.

Edit `html/partials/navbar.html` to update navigation on both pages. Links in this partial resolve relative to the pages in `html/`. The newcomer link is marked active only on `newcomer.html`.
