
const STORAGE_KEY = 'userList';

let users = []; 
let editingIndex = null;

document.addEventListener('DOMContentLoaded', () => {

  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      users = JSON.parse(raw);
    } catch (e) {
      users = [];
    }
  }
  renderTable();

  const form = document.getElementById('userForm');
  form.addEventListener('submit', onSubmit);
  document.getElementById('btnClear').addEventListener('click', clearForm);

  document.getElementById('search').addEventListener('input', (e) => {
    renderTable(e.target.value);
  });
});

function onSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  if (!name || !email) {
    alert('Nome e email são obrigatórios.');
    return;
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    alert('Email inválido.');
    return;
  }

  if (password.length < 6) {
    alert('Senha deve ter pelo menos 6 caracteres.');
    return;
  }

  const user = { name, email, role, createdAt: new Date().toISOString() };

  if (editingIndex !== null) {

    users[editingIndex] = user;
    editingIndex = null;
  } else {
    users.push(user);
  }

  saveAndRender();
  clearForm();
}

function renderTable(filter = '') {
  const tbody = document.querySelector('#usersTable tbody');
  tbody.innerHTML = '';
  const q = filter.toLowerCase();

  users.forEach((u, i) => {
    if (q && !(u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))) return;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.role}</td>
      <td class="actions-btn">
        <button class="small-btn" onclick="onEdit(${i})">Editar</button>
        <button class="small-btn" onclick="onDelete(${i})">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function onEdit(index) {
  const u = users[index];
  document.getElementById('name').value = u.name;
  document.getElementById('email').value = u.email;
  document.getElementById('password').value = ''; 
  document.getElementById('role').value = u.role;
  editingIndex = index;

}

function onDelete(index) {

  const copy = users.slice();
  copy.splice(index, 1);
  users = copy;
  saveAndRender();
}

function clearForm() {
  document.getElementById('userForm').reset();
  editingIndex = null;
}

function saveAndRender() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Erro ao salvar no localStorage', e);
  }
  renderTable();
}
