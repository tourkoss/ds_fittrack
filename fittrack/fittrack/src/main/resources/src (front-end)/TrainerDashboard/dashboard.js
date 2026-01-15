document.addEventListener("DOMContentLoaded", () => {
    checkTrainerAuth();
    loadMySlots();
});

function checkTrainerAuth() {
    const token = sessionStorage.getItem("token");
    const roles = sessionStorage.getItem("roles") || "";
    
    if (!token) {
        window.location.href = "../LoginRegister/login_register.html";
    }
}

//? Create New Slot
document.getElementById("createSlotForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const startTime = document.getElementById("slotStart").value;
    const duration = document.getElementById("slotDuration").value;
    const type = document.getElementById("activityType").value;

    const startDate = new Date(startTime);
    const endDate = new Date(startDate.getTime() + duration * 60000);
    
    const format = (d) => d.toISOString().slice(0, 19);

    const payload = {
        startTime: format(startDate),
        endTime: format(endDate),
        activityType: type
    };

    try {
        const token = sessionStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/availability/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            showAlert("Slot created successfully!", "success");
            loadMySlots();
        } else {
            const txt = await response.text();
            showAlert("Error: " + txt, "danger");
        }
    } catch (err) {
        showAlert("Server error.", "danger");
    }
});

//? Load Slots
async function loadMySlots() {
    const container = document.getElementById("mySlotsContainer");
    const token = sessionStorage.getItem("token");
    
    try {
        const response = await fetch("http://localhost:8080/api/availability/my-slots", {
            headers: { "Authorization": "Bearer " + token }
        });

        if (!response.ok) throw new Error("Failed to fetch");
        
        const slots = await response.json();
        container.innerHTML = "";

        if (slots.length === 0) {
            container.innerHTML = `<p class="text-muted">No slots created yet.</p>`;
            return;
        }

        slots.forEach(slot => {
            const isBooked = slot.booked;
            const dateObj = new Date(slot.startTime);
            const dateStr = dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            container.innerHTML += `
                <div class="col-md-6 col-lg-4">
                    <div class="card p-3 slot-card ${isBooked ? 'booked' : ''}">
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="text-white mb-0">${slot.activityType || 'Training'}</h5>
                            <span class="badge ${isBooked ? 'bg-danger' : 'bg-success'}">${isBooked ? 'Booked' : 'Open'}</span>
                        </div>
                        <p class="mt-2 text-muted mb-1"><i class="fa-regular fa-clock"></i> ${dateStr}</p>
                        ${isBooked ? '<small class="text-warning">Client has booked this.</small>' : 
                        `<button class="btn btn-outline-danger btn-sm mt-2" onclick="deleteSlot(${slot.id})">Delete</button>`}
                    </div>
                </div>
            `;
        });

    } catch (e) {
        console.error(e);
        container.innerHTML = `<p class="text-danger">Backend not connected yet. (Mocking display...)</p>`;
    }
}

function deleteSlot(id) {
    if(!confirm("Delete this slot?")) return;
    showAlert("Slot deleted (Mock)", "warning");
}

function showAlert(msg, type) {
    const box = document.getElementById("alertContainer");
    box.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
    setTimeout(() => box.innerHTML = "", 3000);
}

function logout() {
    sessionStorage.clear();
    window.location.href = "../index.html";
}
