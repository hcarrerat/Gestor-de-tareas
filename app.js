document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskModal = document.getElementById('task-modal');
    const closeBtn = document.querySelector('.close-btn');
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const filterPriority = document.getElementById('filter-priority');
    const filterLabel = document.getElementById('filter-label');
    const applyFilterBtn = document.getElementById('apply-filter-btn');
    let tasks = [];
  
    addTaskBtn.addEventListener('click', () => {
      openModal();
    });
  
    closeBtn.addEventListener('click', () => {
      closeModal();
    });
  
    window.addEventListener('click', (event) => {
      if (event.target == taskModal) {
        closeModal();
      }
    });
  
    taskForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const taskId = document.getElementById('task-id').value;
      const title = document.getElementById('task-title').value;
      const description = document.getElementById('task-desc').value;
      const dueDate = document.getElementById('task-due').value;
      const priority = document.getElementById('task-priority').value;
      const labels = document.getElementById('task-labels').value.split(',').map(label => label.trim());
  
      if (taskId) {
        updateTask(taskId, { title, description, dueDate, priority, labels });
      } else {
        addTask({ title, description, dueDate, priority, labels });
      }
  
      closeModal();
      taskForm.reset();
    });
  
    applyFilterBtn.addEventListener('click', () => {
      renderTasks();
    });
  
    function openModal(task = {}) {
      taskModal.style.display = 'block';
      document.getElementById('task-id').value = task._id || '';
      document.getElementById('task-title').value = task.title || '';
      document.getElementById('task-desc').value = task.description || '';
      document.getElementById('task-due').value = task.dueDate || '';
      document.getElementById('task-priority').value = task.priority || 'Low';
      document.getElementById('task-labels').value = task.labels ? task.labels.join(',') : '';
    }
  
    function closeModal() {
      taskModal.style.display = 'none';
    }
  
    function addTask(task) {
      task._id = new Date().getTime().toString();
      tasks.push(task);
      renderTasks();
    }
  
    function updateTask(taskId, updatedTask) {
      tasks = tasks.map(task => task._id === taskId ? { ...task, ...updatedTask } : task);
      renderTasks();
    }
  
    function deleteTask(taskId) {
      tasks = tasks.filter(task => task._id !== taskId);
      renderTasks();
    }
  
    function renderTasks() {
      const filterPriorityValue = filterPriority.value;
      const filterLabelValue = filterLabel.value.trim().toLowerCase();
      const filteredTasks = tasks.filter(task => {
        const matchesPriority = filterPriorityValue === 'All' || task.priority === filterPriorityValue;
        const matchesLabel = !filterLabelValue || task.labels.some(label => label.toLowerCase().includes(filterLabelValue));
        return matchesPriority && matchesLabel;
      });
  
      taskList.innerHTML = '';
      filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>
            <strong>${task.title}</strong><br>
            ${task.description ? `<em>${task.description}</em><br>` : ''}
            Vence: ${task.dueDate} | Prioridad: ${task.priority} | Etiquetas: ${task.labels.join(', ')}
          </span>
          <button onclick="editTask('${task._id}')">Editar</button>
          <button onclick="deleteTask('${task._id}')">Eliminar</button>
        `;
        taskList.appendChild(li);
      });
    }
  
    window.editTask = function (taskId) {
      const task = tasks.find(task => task._id === taskId);
      openModal(task);
    };
  
    window.deleteTask = function (taskId) {
      deleteTask(taskId);
    };
  });
  