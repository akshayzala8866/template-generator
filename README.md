# 🧠 Code Template API

## 🚀 Project Objective

This project provides a **production-ready HTTP API** that accepts:

- A **programming language identifier** (e.g., `python`, `javascript`, etc.)
- A **DSA (Data Structures and Algorithms) problem description**

...and returns an **executable code skeleton/template** that allows a candidate to start coding immediately — similar to platforms like **LeetCode**, **HackerRank**, or **CodeSignal**.

---

## 📦 Tech Stack

- **Node.js** + **Express.js**
- **TypeScript** for static typing
- **Zod** for schema validation
- **Nodemon** for hot-reloading in development
- **tsc** (TypeScript Compiler) for build process
- **rimraf** to clean the build directory before compiling

### Here is the .env variables to run the project

```
# Server configuration
PORT=3000

# Application mode
NODE_ENV=development
```

---

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone git@github.com:akshayzala8866/template-generator.git
cd template-generator
```

### 2. Install dependencies

```
npm install --save
```

### 3. 🚧 Development

```
npm run start
```

### 4. 🏗️ Build for Production

```
npm run build
```
