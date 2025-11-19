
# Habit Battles

A full-stack application for tracking and competing in habit challenges.

## Project Structure

```
Habit_Battles/
├── frontend/          # React-based user interface
├── backend/           # Server and API logic
├── scripts/           # Utility scripts
└── README.md
```

## Getting Started

### Prerequisites
- Node.js
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies for both frontend and backend

### Running the Application

**Backend only:**
```bash
./test.sh
```

**Frontend and Backend:**
```bash
./dev.sh
```

## Repository Note

This repository contains code compiled from over 30 commits into a single commit due to local repository gitignore issues.

## Features

- Track daily habits
- Compete with others in habit challenges
- Real-time progress updates

## Project Background

This project was created to solve a specific problem: my friend and I wanted to compete on completing daily habits. I built this as a full-stack solution to improve my MongoDB and Mongoose skills while creating a functional application for habit tracking competitions.

The architecture uses separate schemas for users, challenges, and habits that work together seamlessly. The React frontend provides an intuitive interface, while the Node.js/Express backend with Mongoose manages all data persistence and relationships.
