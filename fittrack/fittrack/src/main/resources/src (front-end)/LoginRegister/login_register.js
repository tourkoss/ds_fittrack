//? Flipping the card
document.querySelectorAll('.flip-button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('.card-flip').classList.toggle('flipped');
    });
});

//? Login Logic
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8080/api/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if(response.ok) {
            const data = await response.json();
            
            sessionStorage.setItem('token', data.accessToken);
            sessionStorage.setItem('username', data.username);
            
            sessionStorage.setItem('roles', JSON.stringify(data.roles));

            showAlert('Login successful! Redirecting...', "success");
            setTimeout(() => window.location.href = "../index.html", 1000);
        } else {
            showAlert('Invalid credentials', "danger");
        }
    } catch (err) {
        console.error(err);
        showAlert('Server error during login', "danger");
    }
});

//? Register Logic
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('regUsername').value;
    const firstName = document.getElementById('regFirstName').value;
    const lastName = document.getElementById('regLastName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    
    const isTrainer = document.getElementById('regIsTrainer').checked;
    
    const roles = isTrainer ? ["trainer"] : ["trainee"];

    try {
        const response = await fetch('http://localhost:8080/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify({
                username, 
                firstName, 
                lastName, 
                email, 
                password, 
                roles: roles 
            }),
        });

        if(response.ok) {
            showAlert('Registration successful! Please log in.', "success");
            document.querySelector('.card-flip').classList.remove('flipped');
            document.getElementById('registerForm').reset();
        } else {
            const error = await response.json();
            showAlert(`Registration failed: ${error.message}`, "warning");
        }
    } catch (err) {
        console.error(err);
        showAlert('Server error during registration', "danger");
    }
});

function showAlert(message, type = 'info') {
    const container = document.getElementById('alertContainer');
    const div = document.createElement('div');
    div.className = `alert alert-${type} alert-dismissible fade show`;
    div.innerHTML = `${message} <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    container.appendChild(div);
    setTimeout(() => div.remove(), 4000);
}
