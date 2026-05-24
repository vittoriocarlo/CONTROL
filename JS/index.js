// Carga inicial desde LocalStorage
let records = JSON.parse(localStorage.getItem('pure_css_tool_records')) || [];
let currentFilter = 'all';

const loanForm = document.getElementById('loanForm');
const toolCodeInput = document.getElementById('toolCode');
const toolNameInput = document.getElementById('toolName');
const borrowerNameInput = document.getElementById('borrowerName');
const recordsTableBody = document.getElementById('recordsTableBody');
const emptyState = document.getElementById('emptyState');

// Escucha cuando se guarda el formulario
loanForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const nuevoRegistro = {
        id: Date.now(),
        code: toolCodeInput.value.trim().toUpperCase(), // Guarda el código siempre en mayúsculas
        tool: toolNameInput.value.trim(),
        borrower: borrowerNameInput.value.trim(),
        loanDate: new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }),
        returnDate: '-',
        status: 'Prestado'
    };

    records.unshift(nuevoRegistro); // Lo mete al principio de la lista
    saveAndRender();
    loanForm.reset();
    toolCodeInput.focus();
});

// Guarda en LocalStorage y actualiza la vista
function saveAndRender() {
    localStorage.setItem('pure_css_tool_records', JSON.stringify(records));
    renderRecords();
}

// Alternar estados (Prestado <-> Devuelto)
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

// Eliminar fila
function deleteRecord(id) {
    if (confirm('¿Deseas eliminar este registro de la base de datos local?')) {
        records = records.filter(record => record.id !== id);
        saveAndRender();
    }
}

// Manejador de botones de filtro
function filterRecords(filter) {
    currentFilter = filter;
    
    // Cambiar estados visuales de los botones de filtro
    document.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active'));
    if (filter === 'all') document.getElementById('btnFilterAll').classList.add('active');
    if (filter === 'Prestado') document.getElementById('btnFilterPrestado').classList.add('active');
    if (filter === 'Devuelto') document.getElementById('btnFilterDevuelto').classList.add('active');

    renderRecords();
}

// Dibuja la tabla en el HTML
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