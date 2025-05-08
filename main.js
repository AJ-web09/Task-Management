document.addEventListener('DOMContentLoaded', function() {
  // State
  let tasks = [
    { id: "1", text: "Learn CSS Animations", completed: false, color: "blue" },
    { id: "2", text: "Build a to-do list", completed: false, color: "green" },
    { id: "3", text: "Share your creation", completed: false, color: "purple" }
  ];
  let activeTab = 'all';
  let selectedColor = 'blue';

  // DOM Elements
  const taskInput = document.querySelector('.task-input');
  const addButton = document.querySelector('.add-button');
  const tasksContainer = document.querySelector('.tasks-container');
  const colorOptions = document.querySelectorAll('.color-option');
  const tabs = document.querySelectorAll('.tab');
  const tasksCounter = document.getElementById('tasks-counter');

  // Color mapping
  const colorMap = {
    blue: '#3b82f6',
    green: '#10b981',
    purple: '#8b5cf6',
    red: '#ef4444',
    amber: '#f59e0b',
    pink: '#ec4899'
  };

  // Initialize
  renderTasks();
  updateTasksCounter();

  // Event Listeners
  addButton.addEventListener('click', addTask);
  taskInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      addTask();
    }
  });

  colorOptions.forEach(option => {
    option.addEventListener('click', function() {
      colorOptions.forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
      selectedColor = this.getAttribute('data-color');
    });
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      activeTab = this.getAttribute('data-tab');
      renderTasks();
    });
  });

  // Functions
  function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;

    const newTask = {
      id: Date.now().toString(),
      text: text,
      completed: false,
      color: selectedColor
    };

    tasks.push(newTask);
    taskInput.value = '';
    renderTasks();
    updateTasksCounter();
  }

  function toggleTask(id) {
    tasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    renderTasks();
    updateTasksCounter();
  }

  function deleteTask(id) {
    const taskElement = document.querySelector(`[data-id="${id}"]`);
    if (taskElement) {
      taskElement.classList.add('removing');
      setTimeout(() => {
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
        updateTasksCounter();
      }, 300);
    }
  }

  function renderTasks() {
    tasksContainer.innerHTML = '';
    
    const filteredTasks = tasks.filter(task => {
      if (activeTab === 'active') return !task.completed;
      if (activeTab === 'completed') return task.completed;
      return true;
    });

    if (filteredTasks.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.className = 'empty-message';
      emptyMessage.textContent = activeTab === 'all' 
        ? 'Add your first task!' 
        : activeTab === 'active' 
          ? 'No active tasks' 
          : 'No completed tasks';
      tasksContainer.appendChild(emptyMessage);
      return;
    }

    filteredTasks.forEach(task => {
      const taskElement = document.createElement('div');
      taskElement.className = `task ${task.completed ? 'completed' : ''}`;
      taskElement.setAttribute('data-id', task.id);
      taskElement.style.borderLeft = `4px solid ${colorMap[task.color]}`;
      
      const taskLeft = document.createElement('div');
      taskLeft.className = 'task-left';
      
      const checkbox = document.createElement('div');
      checkbox.className = `task-checkbox ${task.completed ? 'checked' : ''}`;
      checkbox.innerHTML = task.completed ? '✓' : '';
      checkbox.addEventListener('click', () => toggleTask(task.id));
      
      const taskText = document.createElement('span');
      taskText.className = 'task-text';
      taskText.textContent = task.text;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-button';
      deleteBtn.innerHTML = '×';
      deleteBtn.addEventListener('click', () => deleteTask(task.id));
      
      taskLeft.appendChild(checkbox);
      taskLeft.appendChild(taskText);
      
      taskElement.appendChild(taskLeft);
      taskElement.appendChild(deleteBtn);
      
      tasksContainer.appendChild(taskElement);
    });
  }

  function updateTasksCounter() {
    const activeTasksCount = tasks.filter(t => !t.completed).length;
    tasksCounter.textContent = `${activeTasksCount} tasks left to complete`;
  }
});