document.addEventListener('DOMContentLoaded', function() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const rowCheckboxes = document.querySelectorAll('.select-row');
    const deleteForm = document.getElementById('deleteForm');
    const selectedIdsInput = document.getElementById('selectedIds');
    const deleteBtn = document.getElementById('deleteBtn');
    const filterBtn = document.getElementById('filterBtn');
    const filterModal = document.getElementById('filterModal');
    const filterAZBtn = document.getElementById('filterAZBtn');
    const filterNumBtn = document.getElementById('filterNumBtn');
    const roomRows = document.querySelectorAll('.student-table tbody tr');
    const addBtn = document.getElementById('addBtn');
    const addRoomModal = document.getElementById('addRoomModal');
    const addRoomForm = document.getElementById('addRoomForm');
    const closeBtns = document.querySelectorAll('.modal .close');
    const roomIdInput = document.getElementById('roomName'); // Corrigido o ID do input
    const roomNameInput = document.getElementById('roomName');
    const roomNumberInput = document.getElementById('roomNumber');
    const roomTimeSelect = document.getElementById('roomTime');

    // Função para abrir a modal de adição
    addBtn.addEventListener('click', function() {
        addRoomModal.style.display = 'block';
    });

    // Função para fechar modals
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            btn.closest('.modal').style.display = 'none';
        });
    });

    // Fecha a modal ao clicar fora dela
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    addRoomForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const formData = new FormData(addRoomForm);

        fetch(addRoomForm.action, {
            method: "POST",
            headers: {
                "X-CSRFToken": formData.get("csrfmiddlewaretoken"),
                "X-Requested-With": "XMLHttpRequest",
            },
            body: formData,
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(data => {
                    throw new Error(data.errors);
                });
            }
        }).then(data => {
            alert(data.message);
            addRoomModal.style.display = "none";
            window.location.reload();
        }).catch(error => {
            console.error("Erro:", error);
            alert("Erro ao adicionar a sala: " + error.message);
        });
    });

    // Função para atualizar o estado do checkbox "Select All"
    function updateSelectAllState() {
        const allChecked = Array.from(rowCheckboxes).every(checkbox => checkbox.checked);
        selectAllCheckbox.checked = allChecked;
    }

    selectAllCheckbox.addEventListener('change', function() {
        rowCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
    });

    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (checkbox.checked) {
                roomNameInput.value = checkbox.getAttribute('data-sala');

            }
            updateSelectAllState();
        });
    });

    deleteForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const selectedIds = Array.from(rowCheckboxes)
                                .filter(checkbox => checkbox.checked)
                                .map(checkbox => checkbox.getAttribute('data-id'));

        if (selectedIds.length > 0) {
            selectedIdsInput.value = selectedIds.join(',');
            deleteForm.submit();
        } else {
            alert('Por favor, selecione pelo menos uma sala para excluir.');
        }
    });

    deleteBtn.addEventListener('click', function() {
        deleteForm.dispatchEvent(new Event('submit'));
    });

    filterAZBtn.addEventListener('click', function() {
        sortRoomsAlphabetically();
        filterModal.style.display = 'none';
    });

    filterNumBtn.addEventListener('click', function() {
        sortRoomsNumerically();
        filterModal.style.display = 'none';
    });

    filterBtn.addEventListener('click', function() {
        filterModal.style.display = 'block';
    });

    function populateAvailableTimes() {
        const availableTimes = [
            '07:05',
            '09:00',
            '13:00',
            '15:00',
        ];

        roomTimeSelect.innerHTML = ''; // Limpa as opções atuais

        availableTimes.forEach(time => {
            const option = document.createElement('option');
            option.value = time;
            option.textContent = time;
            roomTimeSelect.appendChild(option);
        });
    }

    // Evento de clique para abrir o modal de agendamento
    addBtn.addEventListener('click', function() {
        const selectedCheckbox = document.querySelector('.select-row:checked');
        if (selectedCheckbox) {
            roomIdInput.value = selectedCheckbox.getAttribute('data-id');
        }
        // Popula os horários disponíveis
        populateAvailableTimes();
        // Abre o modal de agendamento
        addRoomModal.style.display = 'block';
    });

    // Evento de envio do formulário de agendamento
    addRoomForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(addRoomForm);

        // Adiciona o ID da sala selecionada ao formulário de agendamento
        formData.append('sala_id', roomIdInput.value);

        fetch(addRoomForm.action, {
            method: "POST",
            headers: {
                "X-CSRFToken": formData.get("csrfmiddlewaretoken"),
                "X-Requested-With": "XMLHttpRequest",
            },
            body: formData,
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(data => {
                    throw new Error(data.errors);
                });
            }
        }).then(data => {
            alert(data.message);
            addRoomModal.style.display = "none";
            window.location.reload();
        }).catch(error => {
            console.error("Erro:", error);
            alert("Erro ao agendar a sala: " + error.message);
        });
    });
});
