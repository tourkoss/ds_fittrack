const token = sessionStorage.getItem('token');
if (!token) {
    window.location.href = "../LoginRegister/login_register.html";
}

const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
};

document.addEventListener("DOMContentLoaded", () => {
    loadProfile();
    loadLogs();
});

async function loadProfile() {
    try {
        const res = await fetch('http://localhost:8080/api/trainee/profile', { headers });
        if (res.ok) {
            const data = await res.json();
            document.getElementById('weightInput').value = data.weight || ''; 
            document.getElementById('goalsInput').value = data.goals || '';
        } else {
            console.error("Failed to fetch profile");
        }
    } catch (err) {
        console.error("Error loading profile:", err);
    }
}

document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const weight = document.getElementById('weightInput').value;
    const goals = document.getElementById('goalsInput').value;

    const payload = {
        weight: weight,
        goals: goals
    };

    try {
        const res = await fetch('http://localhost:8080/api/trainee/profile/update', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert("Profile updated successfully!");
        } else {
            alert("Error updating profile.");
        }
    } catch (err) {
        console.error(err);
        alert("Server error.");
    }
});

async function loadLogs() {
    const list = document.getElementById('logsList');
    list.innerHTML = `<li class="list-group-item text-center text-muted py-3">Loading...</li>`;

    try {
        const res = await fetch('http://localhost:8080/api/trainee/logs', { headers });
        const logs = await res.json();
        
        list.innerHTML = "";

        if (logs.length === 0) {
            list.innerHTML = `<li class="list-group-item text-center text-muted py-3">No logs found. Start adding activities!</li>`;
            return;
        }

        logs.forEach(log => {
            const li = document.createElement('li');
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            
            let icon = '<i class="fa-solid fa-dumbbell"></i>';
            if (log.logType === 'Running') icon = '<i class="fa-solid fa-person-running"></i>';
            if (log.logType === 'Cycling') icon = '<i class="fa-solid fa-bicycle"></i>';
            if (log.logType === 'Weight Check') icon = '<i class="fa-solid fa-weight-scale"></i>';

            li.innerHTML = `
                <div class="d-flex align-items-center">
                    <div class="me-3 fs-4 text-secondary">${icon}</div>
                    <div>
                        <strong class="text-dark">${log.logType}</strong>
                        <div class="text-muted small"><i class="fa-regular fa-calendar"></i> ${log.date}</div>
                    </div>
                </div>
                <span class="badge bg-primary rounded-pill fs-6">${log.value}</span>
            `;
            list.appendChild(li);
        });

    } catch (err) {
        console.error("Error loading logs", err);
        list.innerHTML = `<li class="list-group-item text-center text-danger">Error loading data.</li>`;
    }
}

document.getElementById('logForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const type = document.getElementById('logType').value;
    const value = document.getElementById('logValue').value;

    const payload = {
        logType: type,
        value: value
    };

    try {
        const res = await fetch('http://localhost:8080/api/trainee/logs/add', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            document.getElementById('logValue').value = '';
            loadLogs();
        } else {
            alert("Failed to add log.");
        }
    } catch (err) {
        alert("Server error.");
    }
});

function logout() {
    sessionStorage.clear();
    window.location.href = "../index.html";
}
