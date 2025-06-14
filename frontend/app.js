const API_BASE = 'http://rep-tracker.atwebpages.com/api';
const LOGIN_API = 'http://rep-tracker.atwebpages.com/api/users/login';

const loginView = document.getElementById('login-view');
const appView = document.getElementById('app-view');

// Show/hide views
function showLogin() {
  loginView.style.display = 'block';
  appView.style.display = 'none';
}

function showApp() {
  loginView.style.display = 'none';
  appView.style.display = 'block';
  loadUsers();
}

// Check localStorage
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (currentUser) showApp();
else showLogin();

// LOGIN
document.getElementById('login-form').addEventListener('submit', async e => {
  e.preventDefault();

  const name = document.getElementById('login-name').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch('https://rep-tracker.kesug.com/api/users/login', {
      method: 'POST', // Use POST for sensitive data
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: name, password: password }) // Include data in body
    });

    if (!res.ok) {
      throw new Error(`Server responded with status: ${res.status}`);
    }

    const user = await res.json();
    localStorage.setItem('currentUser', JSON.stringify(user));
    showApp(); // Show the main app view
  } catch (error) {
    console.error('Error during login:', error);
    alert('Login failed. Please try again.');
  }
});

// LOGOUT
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  showLogin();
});

// ADD USER
document.getElementById('user-form').addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const password = document.getElementById('password').value;

  await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, password })
  });

  e.target.reset();
  loadUsers();
});

// LOAD USER LIST
async function loadUsers() {
  const res = await fetch(API_BASE);
  const users = await res.json();

  const list = document.getElementById('user-list');
  list.innerHTML = '';

  users.forEach(user => {
    const li = document.createElement('li');
    li.textContent = `${user.name} (${user.password})`;

    const del = document.createElement('button');
    del.textContent = '🗑️';
    del.onclick = async () => {
      await fetch(`${API_BASE}/${user.id}`, { method: 'DELETE' });
      loadUsers();
    };

    li.appendChild(del);
    list.appendChild(li);
  });
}