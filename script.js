// ThreadSim - Core Logic
class Thread {
    constructor(id) {
        this.id = id;
        this.state = 'ready'; // ready, running, waiting, terminated
        this.totalTimeNeeded = Math.floor(Math.random() * 5) + 3; // 3-7 seconds
        this.timeExecuted = 0;
        this.element = null;
    }

    createDOMElement() {
        const div = document.createElement('div');
        div.className = `thread-block state-${this.state}`;
        div.id = `thread-${this.id}`;
        
        div.innerHTML = `
            <div class="thread-header">
                <span class="thread-id">T-${this.id}</span>
                <span class="thread-state-text">${this.state}</span>
            </div>
            <div class="thread-progress">
                <div class="progress-bar" style="width: ${(this.timeExecuted / this.totalTimeNeeded) * 100}%"></div>
            </div>
            <div class="thread-time"><span class="executed-time">${this.timeExecuted}</span>/${this.totalTimeNeeded}s</div>
        `;
        
        this.element = div;
        return div;
    }

    updateDOMElement() {
        if (!this.element) return;
        
        this.element.className = `thread-block state-${this.state}`;
        
        const stateText = this.element.querySelector('.thread-state-text');
        if(stateText) stateText.textContent = this.state;
        
        const progressBar = this.element.querySelector('.progress-bar');
        if(progressBar) progressBar.style.width = `${(this.timeExecuted / this.totalTimeNeeded) * 100}%`;
        
        const timeText = this.element.querySelector('.executed-time');
        if(timeText) timeText.textContent = this.timeExecuted;
    }
}

class SystemSimulator {
    constructor() {
        this.threads = [];
        this.threadCounter = 1;
        this.isRunning = false;
        this.timeQuantums = 0;
        this.intervalId = null;
        this.maxCores = 1; 
        this.container = document.getElementById('thread-container'); // May be null on other pages
        
        // Semaphore simulation
        this.semaphoreCount = 1;
        this.semaphoreWaitQueue = [];
    }

    init() {
        // Init Simulator Only if we are on the simulator page
        if (this.container) {
            document.getElementById('btn-create').addEventListener('click', () => {
                this.isAutoSimulating = false; // Turn off auto if manual action
                this.createThread();
            });
            document.getElementById('btn-start').addEventListener('click', () => {
                this.isAutoSimulating = false;
                this.startCPU();
            });
            document.getElementById('btn-stop').addEventListener('click', () => {
                this.isAutoSimulating = false;
                this.stopCPU();
            });
            document.getElementById('btn-reset').addEventListener('click', () => {
                this.isAutoSimulating = false;
                this.resetAll();
            });
            
            // Auto Startup Sequence for Demonstration
            this.isAutoSimulating = true;
            for(let i = 0; i < 4; i++) {
                this.createThread();
            }
            setTimeout(() => {
                if (this.isAutoSimulating) this.startCPU();
            }, 500);
            
            this.updateStats();
        }
        
        // Init Semaphore Logic only if we are on sync page
        const semaBtn = document.getElementById('btn-sema-add');
        if (semaBtn) {
            semaBtn.addEventListener('click', () => {
                this.isAutoSyncing = false; // Disable auto if they manually click
                this.simulateSemaphoreRequest();
            });
            
            // Auto Sync Demonstration
            this.isAutoSyncing = true;
            this.simulateSemaphoreRequest();
            setInterval(() => {
                if (this.isAutoSyncing) {
                    this.simulateSemaphoreRequest();
                }
            }, 2500); // Trigger request every 2.5s (faster than release time to cause queuing)
        }
    }

    createThread() {
        if (!this.container) return;
        
        // Clear empty state message if exists
        const emptyState = this.container.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }

        const newThread = new Thread(this.threadCounter++);
        this.threads.push(newThread);
        
        this.container.appendChild(newThread.createDOMElement());
        this.updateStats();
    }

    startCPU() {
        if (this.isRunning || !this.container) return;
        
        this.isRunning = true;
        document.getElementById('btn-start').disabled = true;
        document.getElementById('btn-stop').disabled = false;
        
        const cpuIndicator = document.querySelector('.cpu-indicator');
        if (cpuIndicator) cpuIndicator.classList.add('pulse');
        
        const statCpu = document.getElementById('stat-cpu');
        if (statCpu) {
            statCpu.textContent = 'Active';
            statCpu.className = 'status-badge active';
        }
        
        // Tick game loop every 1 second
        this.intervalId = setInterval(() => this.tick(), 1000);
    }

    stopCPU() {
        if (!this.isRunning || !this.container) return;
        
        this.isRunning = false;
        document.getElementById('btn-start').disabled = false;
        document.getElementById('btn-stop').disabled = true;
        
        const cpuIndicator = document.querySelector('.cpu-indicator');
        if(cpuIndicator) cpuIndicator.classList.remove('pulse');
        
        const statCpu = document.getElementById('stat-cpu');
        if (statCpu) {
            statCpu.textContent = 'Idle';
            statCpu.className = 'status-badge inactive';
        }
        
        clearInterval(this.intervalId);
        
        // Mark running as ready
        this.threads.filter(t => t.state === 'running').forEach(t => {
            t.state = 'ready';
            t.updateDOMElement();
        });
    }

    resetAll() {
        if(!this.container) return;
        this.stopCPU();
        this.threads = [];
        this.threadCounter = 1;
        this.timeQuantums = 0;
        
        this.container.innerHTML = '<div class="empty-state">No threads created. Click "Create Thread" to begin.</div>';
        this.updateStats();
    }

    tick() {
        this.timeQuantums++;
        
        const runningThreads = this.threads.filter(t => t.state === 'running');
        
        // Process running threads
        runningThreads.forEach(t => {
            t.timeExecuted++;
            t.updateDOMElement();
            
            if (t.timeExecuted >= t.totalTimeNeeded) {
                t.state = 'terminated';
                t.updateDOMElement();
            } else {
                // If it wants to do IO (random 10% chance)
                if (Math.random() < 0.1) {
                    t.state = 'waiting';
                    t.updateDOMElement();
                    
                    // Simulate I/O finish in 2-4 seconds
                    setTimeout(() => {
                        if (t.state === 'waiting') {
                            t.state = 'ready';
                            t.updateDOMElement();
                            this.updateStats();
                        }
                    }, (Math.floor(Math.random() * 3) + 2) * 1000);
                } else {
                    // Pre-empt (Round Robin context switch)
                    t.state = 'ready';
                    t.updateDOMElement();
                }
            }
        });
        
        // Schedule next thread
        const updatedRunningThreadsCount = this.threads.filter(t => t.state === 'running').length;
        
        if (updatedRunningThreadsCount < this.maxCores) {
            const upNext = this.threads.find(t => t.state === 'ready');
            if (upNext) {
                upNext.state = 'running';
                upNext.updateDOMElement();
            }
        }
        
        this.updateStats();
    }

    updateStats() {
        if(!this.container) return;
        const statThreads = document.getElementById('stat-threads');
        const statTime = document.getElementById('stat-time');
        
        if(statThreads) statThreads.textContent = this.threads.filter(t => t.state !== 'terminated').length;
        if(statTime) statTime.textContent = this.timeQuantums;
    }
    
    // SEMAPHORE LOGIC
    simulateSemaphoreRequest() {
        const threadId = Math.floor(Math.random() * 900) + 100; // Random 3 digit ID
        
        if (this.semaphoreCount > 0) {
            // Can enter critical section
            this.semaphoreCount--;
            this.updateSemaphoreUI();
            
            const slot = document.querySelector('.resource-slots .slot.empty');
            if (slot) {
                slot.className = 'slot occupied';
                slot.innerHTML = `<i class="fas fa-microchip"></i> T-${threadId}`;
            }
            
            // Release after 3-5 seconds
            setTimeout(() => {
                this.semaphoreCount++;
                if (slot) {
                    slot.className = 'slot empty';
                    slot.innerHTML = 'Available';
                }
                this.updateSemaphoreUI();
                this.checkWaitQueue();
            }, (Math.floor(Math.random() * 3) + 3) * 1000);
            
        } else {
            // Must wait
            this.semaphoreWaitQueue.push(threadId);
            this.updateSemaphoreUI();
        }
    }
    
    checkWaitQueue() {
        if (this.semaphoreWaitQueue.length > 0 && this.semaphoreCount > 0) {
            const nextThread = this.semaphoreWaitQueue.shift();
            
            // Simulate that thread requesting again immediately
            this.semaphoreCount--;
            this.updateSemaphoreUI();
            
            const slot = document.querySelector('.resource-slots .slot.empty');
            if (slot) {
                slot.className = 'slot occupied';
                slot.innerHTML = `<i class="fas fa-microchip"></i> T-${nextThread}`;
            }
            
            setTimeout(() => {
                this.semaphoreCount++;
                if (slot) {
                    slot.className = 'slot empty';
                    slot.innerHTML = 'Available';
                }
                this.updateSemaphoreUI();
                this.checkWaitQueue();
            }, (Math.floor(Math.random() * 3) + 3) * 1000);
        }
    }
    
    updateSemaphoreUI() {
        document.getElementById('sema-count').textContent = this.semaphoreCount;
        
        const queueContainer = document.getElementById('queue-container');
        if(!queueContainer) return;
        
        if (this.semaphoreWaitQueue.length === 0) {
            queueContainer.innerHTML = '<div class="empty-queue-msg">Queue is empty</div>';
        } else {
            queueContainer.innerHTML = '';
            this.semaphoreWaitQueue.forEach(id => {
                const el = document.createElement('div');
                el.className = 'queued-thread';
                el.textContent = `T${id}`;
                queueContainer.appendChild(el);
            });
        }
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Inject floating bubbles for UI/UX
    const bubbleContainer = document.querySelector('.bg-blobs');
    if (bubbleContainer) {
        for (let i = 0; i < 20; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            
            // Randomize size, position, and animation timing
            const size = Math.random() * 60 + 20; // 20px - 80px
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            
            bubble.style.left = `${Math.random() * 100}%`;
            bubble.style.animationDuration = `${Math.random() * 10 + 8}s`; // 8s - 18s duration
            bubble.style.animationDelay = `${Math.random() * 10}s`; // Staggered starts
            
            bubbleContainer.appendChild(bubble);
        }
    }

    const simulator = new SystemSimulator();
    simulator.init();
});
