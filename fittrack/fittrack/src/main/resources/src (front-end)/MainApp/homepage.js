//? Globals
let currentFilter = "all";

//? Run on page load
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus(); 
    displaySessions();  
});

//? ----------------------------------------------------
//? AUTH LOGIC
//? ----------------------------------------------------

function checkLoginStatus() {
    const headerContent = document.getElementById('headerRightContent');
    const token = sessionStorage.getItem('token');
    const username = sessionStorage.getItem('username');
    
    let roles = [];
    try {
        roles = JSON.parse(sessionStorage.getItem('roles')) || [];
    } catch (e) {
        roles = [];
    }
    
    const isTrainer = roles.includes("ROLE_TRAINER");
    const isTrainee = roles.includes("ROLE_TRAINEE") || roles.includes("ROLE_USER");

    if (token && username) {
        
        let actionButtons = '';
        
        if (isTrainer) {
            actionButtons += `
                <a href="./TrainerDashboard/dashboard.html" class="btn btn-warning fw-bold me-2">
                    <i class="fa-solid fa-calendar-days"></i> Trainer Panel
                </a>
            `;
        }

        if (isTrainee) {
            actionButtons += `
                <a href="./TraineeDashboard/dashboard.html" class="btn btn-primary fw-bold me-2">
                    <i class="fa-solid fa-person-running"></i> My Dashboard
                </a>
            `;
        }

        headerContent.innerHTML = `
            ${actionButtons} 
            <span class="text-white me-2 d-none d-md-block">Welcome, <strong>${username}</strong></span>
            <button class="btn btn-outline-danger btn-sm" onclick="logout()">
                <i class="fa-solid fa-sign-out-alt"></i> Logout
            </button>
        `;
    } else {
        headerContent.innerHTML = `
            <button class="btn btn-success fw-bold" onclick="window.location.href='./LoginRegister/login_register.html'">
                <i class="fa-solid fa-user"></i> Login / Register
            </button>
        `;
    }
}

function logout() {
    sessionStorage.clear();
    window.location.reload();
}

//? ----------------------------------------------------
//? SESSION DISPLAY LOGIC (REAL DATA)
//? ----------------------------------------------------

async function displaySessions() {
    const container = document.getElementById("sessionsContainer");
    const template = document.getElementById("sessionCardTemplate").content;
    const loadingSpinner = document.getElementById("loadingSpinner");
    const noMsg = document.getElementById("noSessionsMessage");

    loadingSpinner.style.display = "block";
    noMsg.style.display = "none";
    container.innerHTML = "";

    try {
        const endpoint = "http://localhost:8080/api/availability/all"; 
        
        const headers = {};
        const token = sessionStorage.getItem('token');
        
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(endpoint, { method: 'GET', headers: headers });
        
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }
        
        const rawData = await response.json();

        const mappedSessions = rawData.map(slot => {
            return {
                id: slot.id,
                title: slot.activityType || "Training Session",
                trainer: slot.trainer ? slot.trainer.username : "FitTrack Trainer",
                category: "Fitness",
                desc: `${new Date(slot.startTime).toLocaleDateString('en-GB')} @ ${new Date(slot.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
                price: 20, 
                current: slot.booked ? 1 : 0,
                max: 1, 
                status: slot.booked ? "FULL" : "ACTIVE",
                booked: slot.booked
            };
        });

        renderGrid(mappedSessions, template, container);

    } catch (err) {
        console.error("Error loading sessions:", err);
        loadingSpinner.style.display = "none";
        
        container.innerHTML = `
            <div class="col-12 text-center text-white mt-5">
                <i class="fa-solid fa-triangle-exclamation fa-3x text-warning mb-3"></i>
                <h3>Unable to load sessions.</h3>
                <p class="text-muted">Please check your connection or try again later.</p>
            </div>
        `;
    }
}

function renderGrid(sessions, template, container) {
    const loadingSpinner = document.getElementById("loadingSpinner");
    loadingSpinner.style.display = "none";

    if (!sessions || sessions.length === 0) {
        document.getElementById("noSessionsMessage").style.display = "block";
        return;
    }

    sessions.forEach(session => {
        const clone = document.importNode(template, true);

        const imgEl = clone.querySelector("img");
        imgEl.src = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600"; 

        const statusCircle = clone.querySelector(".status-circle");
        const statusText = clone.querySelector(".status-text");
        const isFull = session.booked === true;

        if (!isFull) {
            statusCircle.classList.add("green"); 
            statusText.textContent = "Available";
        } else {
            statusCircle.classList.add("orange"); 
            statusText.textContent = "Booked";
        }

        clone.querySelector(".session-category").textContent = session.category;
        clone.querySelector(".session-title").textContent = session.title;
        clone.querySelector(".session-trainer").textContent = `Trainer: ${session.trainer}`;
        clone.querySelector(".session-desc").textContent = session.desc;
        clone.querySelector(".session-price").textContent = `${session.price}€`;

        const pct = isFull ? 100 : 0;
        clone.querySelector(".progress-bar").style.width = `${pct}%`;
        clone.querySelector(".slots-text").textContent = isFull ? "Slot Taken" : "Slot Open";

        const btn = clone.querySelector(".session-action-btn");
        if (isFull) {
            btn.textContent = "Booked";
            btn.classList.replace("btn-primary", "btn-secondary");
            btn.disabled = true;
        } else {
            btn.textContent = "Details / Book";
            btn.onclick = () => {
                window.location.href = `./SlotDetails/slot_details.html?id=${session.id}`;
            };
        }

        container.appendChild(clone);
    });
}
