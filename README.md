# 🌐 Social Community Dashboard

A dynamic, full-stack social media platform simulation designed to showcase API integration, user authentication, and responsive UI design. Built using Vanilla JavaScript, HTML5, and Bootstrap, this application provides a modern and interactive user experience.

**Live Demo:** [https://socialweb12.netlify.app/](https://socialweb12.netlify.app/)

---

## 📖 Description

The Social Community platform is a single-page-like application where users can browse a dynamic feed of posts, view individual post details, and explore user profiles. It relies on a ready-made external API to handle backend data (such as posts, user data, and authentication states) while utilizing the Bootstrap framework to ensure the interface is clean, modern, and fully responsive across all devices.

---

## ✨ Features

* **Dynamic Post Feed:** Fetches and displays a real-time feed of user posts using an external REST API.
* **User Profiles:** Dedicated profile pages allowing users to view specific user details and their associated posts.
* **Post Details & Comments:** Click into any post to view its full content, metadata, and associated comment threads.
* **Responsive UI:** Fully styled with Bootstrap to guarantee a seamless experience on mobile, tablet, and desktop views.
* **Modular JavaScript:** Organized logic for general setup, main feed rendering, and specific page behaviors.

---

## 🛠️ Tech Stack

This project focuses on strong frontend fundamentals and API communication:

* **Markup:** HTML5
* **Styling:** CSS3 & [Bootstrap 5](https://getbootstrap.com/)
* **Scripting:** Vanilla JavaScript (ES6+)
* **Data Management:** External REST API (JSON)
* **Package Management:** npm (for local dependencies/tooling)
* **Deployment:** Netlify

---

## 🚀 Getting Started

To run this project locally, follow these steps:

### Prerequisites
* Node.js installed on your machine (if you wish to use the local `package.json` setup).
* A modern web browser.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Abdulmalik90/Social-media-web.git](https://github.com/Abdulmalik90/Social-media-web.git)
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd Social-media-web
    ```

3.  **Install dependencies (Optional):**
    If you are utilizing tools defined in the `package.json`:
    ```bash
    npm install
    ```

4.  **Run the application:**
    You can simply open the `index.html` file in your browser, or use a local development server (like VS Code's "Live Server" extension) for a better development experience.

---

## 📁 Project Structure

The project is structured to separate different page logic and assets:

```text
📦 Social-media-web
 ┣ 📂 imgs                # Static image assets
 ┣ 📂 post details        # HTML and specific JS for the individual post view
 ┣ 📂 profile page        # HTML and specific JS for the user profile view
 ┣ 📜 GeneralSetup.js     # Global JavaScript utilities and API configuration
 ┣ 📜 main.js             # Core logic for the main feed/dashboard
 ┣ 📜 index.html          # Main dashboard/feed entry point
 ┣ 📜 style.css           # Custom CSS overrides for Bootstrap
 ┣ 📜 package.json        # Node.js project metadata
 ┗ 📜 README.md
