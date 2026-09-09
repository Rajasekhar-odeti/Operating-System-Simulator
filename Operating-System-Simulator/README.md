# 🖥️ Operating System Simulator — ThreadSim

An interactive web-based **Operating System Simulator** that visually demonstrates important Operating System concepts such as **thread lifecycle, CPU scheduling, thread models, and semaphore synchronization**.

## 🚀 Features

### 🔄 Thread Lifecycle Visualization

- Create and manage multiple threads
- Visualize different thread states:
  - Ready
  - Running
  - Waiting
  - Terminated
- Track thread execution progress
- Display processing time dynamically

### ⚡ CPU Scheduling Simulation

- Start and stop CPU execution
- Simulate CPU context switching
- Demonstrates Round Robin-style preemptive scheduling
- Tracks time quantums during execution
- Displays CPU status and active thread count
- Simulates I/O operations by moving threads into a waiting state

### 🔐 Semaphore Synchronization

- Interactive semaphore simulation
- Demonstrates resource acquisition and release
- Visualizes the Critical Section
- Maintains a waiting queue when resources are unavailable
- Displays available semaphore permits
- Demonstrates mutual exclusion and resource synchronization

### 🧵 Thread Models

The simulator visually demonstrates three important thread mapping models:

- Many-to-One
- One-to-One
- Many-to-Many

These models demonstrate the relationship between user-level threads and kernel-level threads.

### 📊 Live System Tracking

The simulator provides real-time information including:

- CPU status
- Thread count
- Time quantums
- Thread execution progress
- Current thread states
- Semaphore permits
- Waiting threads

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript
- Font Awesome
- Google Fonts (Inter)

## 📂 Project Structure

    Operating-System-Simulator/
    │
    ├── index.html
    ├── features.html
    ├── simulator.html
    ├── models.html
    ├── sync.html
    ├── script.js
    └── style.css

| File | Description |
|------|-------------|
| `index.html` | Main landing page |
| `features.html` | Displays simulator features |
| `simulator.html` | Thread lifecycle and CPU scheduling simulator |
| `models.html` | Thread model visualization |
| `sync.html` | Semaphore synchronization simulation |
| `script.js` | Core JavaScript simulation logic |
| `style.css` | Website styling and animations |

## 🎯 Operating System Concepts

This project demonstrates practical concepts including:

- Threads
- Thread Lifecycle
- Thread States
- CPU Scheduling
- Context Switching
- Preemptive Scheduling
- Round Robin Scheduling
- I/O Waiting
- User-Level Threads
- Kernel-Level Threads
- Many-to-One Thread Model
- One-to-One Thread Model
- Many-to-Many Thread Model
- Semaphores
- Mutual Exclusion
- Critical Sections
- Wait Queues
- Resource Synchronization

## ▶️ How to Run

No backend or database is required because this is a client-side web application.

### 1. Clone the Repository

    git clone https://github.com/YOUR-USERNAME/Operating-System-Simulator.git

### 2. Navigate to the Project

    cd Operating-System-Simulator

### 3. Run the Application

Open `index.html` in a modern web browser.

You can also use **VS Code Live Server** to run the project locally.

## 💡 Project Objective

The objective of this project is to make Operating System concepts easier to understand through **interactive visual simulations**.

Users can interact with the simulator and observe:

- Thread state transitions
- CPU execution
- Context switching
- Scheduling behavior
- Thread models
- Semaphore operations
- Critical-section synchronization

## 🔮 Future Enhancements

- FCFS Scheduling
- SJF Scheduling
- Priority Scheduling
- Configurable Time Quantum
- Multiple CPU Core Simulation
- Process Creation and Termination
- Deadlock Detection
- Deadlock Avoidance
- Memory Management Simulation
- Page Replacement Algorithms
- Disk Scheduling Algorithms
- Scheduling Performance Metrics

## 📸 Screenshots

Add project screenshots here to showcase the simulator interface.

    screenshots/
    ├── home.png
    ├── simulator.png
    ├── models.png
    └── synchronization.png

## 🌐 Live Demo

**Live Demo:**  
https://YOUR-USERNAME.github.io/Operating-System-Simulator/

## 👨‍💻 Author

**Rajasekhar**

Operating System Simulator — ThreadSim

---

⭐ If you find this project useful, consider giving the repository a star!
