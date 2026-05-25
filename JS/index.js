
let records = JSON.parse(localStorage.getItem('pure_css_tool_records')) || [];
let currentFilter = 'all';

// CONFIGURACIÓN DE FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyDYUxzCk6Vi7BnBmBwPbrq7R56sBEAAANo",
    authDomain: "control-herramientas-465af.firebaseapp.com",
    projectId: "control-herramientas-465af",
    databaseURL: "https://control-herramientas-465af-default-rtdb.firebaseio.com",
    storageBucket: "control-herramientas-465af.firebasestorage.app",
    messagingSenderId: "385471713706",
    appId: "1:385471713706:web:42d69242ae14c339ad9bd3"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();



const loanForm = document.getElementById('loanForm');
const toolCodeInput = document.getElementById('toolCode');
const toolNameInput = document.getElementById('toolName');
const borrowerNameInput = document.getElementById('borrowerName');
const recordsTableBody = document.getElementById('recordsTableBody');
const emptyState = document.getElementById('emptyState');


loanForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const nuevoRegistro = {
        id: Date.now(),
        code: toolCodeInput.value.trim().toUpperCase(), 
        tool: toolNameInput.value.trim(),
        borrower: borrowerNameInput.value.trim(),
        loanDate: new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }),
        returnDate: '-',
        status: 'Prestado'
    };

    records.unshift(nuevoRegistro); 
    saveAndRender();
    loanForm.reset();
    toolCodeInput.focus();
});


function saveAndRender() {
    localStorage.setItem('pure_css_tool_records', JSON.stringify(records));
    renderRecords();
}

function toggleStatus(id) {
    records = records.map(record => {
        if (record.id === id) {
            if (record.status === 'Prestado') {
                record.status = 'Devuelto';
                record.returnDate = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
            } else {
                record.status = 'Prestado';
                record.returnDate = '-';
            }
        }
        return record;
    });
    saveAndRender();
}


function deleteRecord(id) {
    if (confirm('¿Deseas eliminar este registro de la base de datos local?')) {
        records = records.filter(record => record.id !== id);
        saveAndRender();
    }
}


function filterRecords(filter) {
    currentFilter = filter;
    
    
    document.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active'));
    if (filter === 'all') document.getElementById('btnFilterAll').classList.add('active');
    if (filter === 'Prestado') document.getElementById('btnFilterPrestado').classList.add('active');
    if (filter === 'Devuelto') document.getElementById('btnFilterDevuelto').classList.add('active');

    renderRecords();
}


function renderRecords() {
    recordsTableBody.innerHTML = '';

    const filtered = records.filter(record => {
        if (currentFilter === 'all') return true;
        return record.status === currentFilter;
    });

    if (filtered.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    filtered.forEach(record => {
        const isPrestado = record.status === 'Prestado';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="code-tag">${record.code}</span></td>
            <td>
                <div class="tool-title">${record.tool}</div>
                <div class="tool-user">👤 ${record.borrower}</div>
            </td>
            <td style="color: var(--text-muted); font-size: 0.85rem;">${record.loanDate}</td>
            <td style="color: var(--text-muted); font-size: 0.85rem;">${record.returnDate}</td>
            <td style="text-align: center;">
                <span class="badge ${isPrestado ? 'badge-prestado' : 'badge-devuelto'}">
                    ${record.status}
                </span>
            </td>
            <td>
                <div class="actions-cell">
                    <button onclick="toggleStatus(${record.id})" 
                        class="btn btn-action ${isPrestado ? 'btn-status-lend' : 'btn-status-return'}">
                        ${isPrestado ? '↩️ Recibir' : '🔄 Reabrir'}
                    </button>
                    <button onclick="deleteRecord(${record.id})" class="btn btn-action btn-delete" title="Eliminar">
                        🗑️
                    </button>
                </div>
            </td>
        `;
        recordsTableBody.appendChild(tr);
    });
}

// Inicialización al abrir la página
renderRecords();