//? Global ID
const sessionId = new URLSearchParams(window.location.search).get("id");

document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    loadSessionDetails();
    setupInfoPanel();
});

function checkAuth() {
    if (!sessionStorage.getItem("token")) {
        window.location.href = "../LoginRegister/login_register.html";
    }
}

//? Fetch and Display Session Info
async function loadSessionDetails() {
    if (!sessionId) {
        document.getElementById('session-info').innerHTML = `<div class="alert alert-danger text-center">Session ID not found.</div>`;
        return;
    }

    try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/api/availability/${sessionId}`, {
            headers: { "Authorization": "Bearer " + token }
        });

        if (!response.ok) throw new Error("Failed to fetch");
        
        const session = await response.json();
        renderSession(session);

    } catch (err) {
        console.warn("Backend error or offline. Showing Mock Data.");
        renderSession({
            id: sessionId,
            title: "Advanced CrossFit",
            description: "High intensity interval training focusing on strength and conditioning. Bring a towel!",
            trainer: { username: "Coach Mike" },
            startTime: "2024-12-25T10:00:00",
            booked: false
        });
    }
}

function renderSession(session) {
    document.getElementById("sessionTitle").textContent = session.title;
    document.getElementById("sessionDesc").textContent = session.description || "No description provided.";
    document.getElementById("trainerName").textContent = session.trainer ? session.trainer.username : "Unknown Trainer";
    
    const dateObj = new Date(session.startTime);
    const dateStr = dateObj.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
    const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById("sessionTime").innerHTML = `${dateStr}<br><span class="fs-5">${timeStr}</span>`;

    const statusBadge = document.getElementById("sessionStatusBadge");
    const actionContainer = document.getElementById("actionButtons");
    const roles = JSON.parse(sessionStorage.getItem("roles") || "[]");
    const isTrainer = roles.includes("ROLE_TRAINER");
    const myUsername = sessionStorage.getItem("username");

    actionContainer.innerHTML = "";

    if (session.booked) {
        statusBadge.textContent = "BOOKED";
        statusBadge.className = "badge bg-danger fs-6";
        
        actionContainer.innerHTML = `<button class="btn btn-secondary" disabled>Slot Taken</button>`;
        
        if (isTrainer && session.trainer.username === myUsername) {
            actionContainer.innerHTML += `<button class="btn btn-outline-danger mt-2" onclick="deleteSession()">Cancel Session</button>`;
        }
    } else {
        statusBadge.textContent = "AVAILABLE";
        statusBadge.className = "badge bg-success fs-6";

        if (isTrainer) {
            actionContainer.innerHTML = `<button class="btn btn-outline-danger" onclick="deleteSession()">Delete Slot</button>`;
        } else {
            actionContainer.innerHTML = `<button class="btn btn-primary fw-bold py-2" data-bs-toggle="modal" data-bs-target="#bookingModal">Book This Session</button>`;
        }
    }

    loadParticipants(session);
}

//? Booking Logic
async function submitBooking() {
    const notes = document.getElementById("clientNotes").value;
    const token = sessionStorage.getItem("token");

    if (!token) {
        showAlert("You must be logged in to book a session.", "warning");
        setTimeout(() => window.location.href = "../LoginRegister/login_register.html", 1500);
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/appointment/${sessionId}/book`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ clientNotes: notes })
        });

        if (response.ok) {
            const modalEl = document.getElementById('bookingModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();
            
            showAlert("Booking confirmed successfully!", "success");
            
            setTimeout(() => loadSessionDetails(), 1000); 
        } else {
            const errorMsg = await response.text();
            console.error("Booking Error:", errorMsg);
            showAlert(`Booking failed: ${errorMsg}`, "danger");
        }
    } catch (e) {
        console.error(e);
        showAlert("Error connecting to server. Check console for details.", "danger");
    }
}

//? Delete Logic
async function deleteSession() {
    if (!confirm("Are you sure you want to cancel/delete this session?")) return;
    
    showAlert("Session cancelled (Mock functionality)", "warning");
    setTimeout(() => window.location.href = "../index.html", 1000);
}

//? Info Panel (Participants) Logic
function setupInfoPanel() {
    const panel = document.getElementById("infoPanel");
    document.getElementById("infoToggleBtn").addEventListener("click", () => {
        panel.style.display = (panel.style.display === "flex") ? "none" : "flex";
    });
    document.getElementById("closeInfoBtn").addEventListener("click", () => {
        panel.style.display = "none";
    });
}

function loadParticipants(session) {
    const list = document.getElementById("participantsList");
    
    if (session.booked) {
        list.innerHTML = `
            <div class="chat-message">
                <strong>Status:</strong> Booked<br>
                <span class="small text-muted">Client details are private.</span>
            </div>`;
    } else {
        list.innerHTML = `<p class="text-center text-muted mt-4">No participants yet.</p>`;
    }
}

function showAlert(message, type = 'info') {
    const container = document.getElementById('alertContainer');
    const div = document.createElement('div');
    div.className = `alert alert-${type} alert-dismissible fade show`;
    div.innerHTML = `${message} <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    container.appendChild(div);
    setTimeout(() => div.remove(), 4000);
}
