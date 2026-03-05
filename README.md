# Join

> Kanban-style project management tool — a training project built during education at Developer Akademie.

## Disclaimer

This is a **training project** built as part of a web development bootcamp at [Developer Akademie](https://developerakademie.com/). It is not a commercial product and is not intended for real-world use.

This application does not provide real project management services. No real business operations are conducted through this website. Any data entered is stored in a cloud database for demonstration purposes only — do not enter sensitive personal information.

The design of **Join** is owned by [Developer Akademie GmbH](https://developerakademie.com/). Unauthorized use, reproduction, modification, or distribution is strictly prohibited.

## About

Join is a web-based Kanban board application that allows users to create, organize, and track tasks across different stages of completion. It features user authentication, contact management, a drag-and-drop task board, and a summary dashboard. Built as a group project to practice frontend development with vanilla technologies.

## Tech Stack

- HTML5
- CSS3 (custom properties, flexbox, responsive design)
- Vanilla JavaScript (ES6+)
- Firebase Realtime Database (REST API)
- Self-hosted Inter font

## Features

- User registration and login (including guest access)
- Task board with columns: To-Do, In Progress, Await Feedback, Done
- Create and edit tasks with title, description, due date, priority, category, subtasks, and assigned contacts
- Contact management — add, edit, and delete contacts
- Summary dashboard with task statistics and upcoming deadlines
- Responsive design for desktop and mobile
- Privacy Policy and Legal Notice pages

## Getting Started

### Prerequisites

- A modern web browser
- A local HTTP server (e.g., Python, Live Server, or similar)

### Running

```bash
# Clone the repository
git clone <repository-url>
cd join/normal

# Start a local server (Python example)
python3 -m http.server 8080

# Open in browser
open http://localhost:8080/login.html
```

Or simply open `login.html` with a VS Code Live Server extension.

## Legal

- [Legal Notice / Impressum](legal_notice.html)
- [Privacy Policy](privacy_policy.html)

## Author

**Simon Maximilian Heistermann**
- Website: [simon-heistermann.de](https://simon-heistermann.de)
- Email: simon@heistermann-solutions.de
- LinkedIn: [Simon Heistermann](https://www.linkedin.com/in/simon-heistermann/)

## License

This project is part of a training curriculum and is not licensed for commercial use. The design is owned by Developer Akademie GmbH.
