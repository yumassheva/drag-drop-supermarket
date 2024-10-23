document.addEventListener('DOMContentLoaded', () => {
  const draggablesData = [
    { id: 'draggable-1', src: './images/bottle.png', alt: 'draggable 1' },
    { id: 'draggable-2', src: './images/milk.png', alt: 'draggable 2' },
    { id: 'draggable-3', src: './images/jam.png', alt: 'draggable 3' },
    { id: 'draggable-4', src: './images/cheese.png', alt: 'draggable 4' },
    { id: 'draggable-5', src: './images/meat.png', alt: 'draggable 5' },
    { id: 'draggable-6', src: './images/leg.png', alt: 'draggable 6' },
    { id: 'draggable-7', src: './images/chips.png', alt: 'draggable 7' },
    { id: 'draggable-8', src: './images/pineapple.png', alt: 'draggable 8' },
    { id: 'draggable-9', src: './images/banana.png', alt: 'draggable 9' },
    { id: 'draggable-10', src: './images/apple.png', alt: 'draggable 10' },
    { id: 'draggable-11', src: './images/latuc.png', alt: 'draggable 11' },
  ];

  let dropZoneItemCount = 0;

  // Function to dynamically create and append draggable elements to containers
  const appendDraggablesToContainer = (draggables, container) => {
    if (!container) {
      console.error('Container not found');
      return;
    }
    draggables.forEach(({ id, src, alt }) => {
      const img = document.createElement('img');
      Object.assign(img, { id, src, alt, draggable: true, className: `draggable ${id}` });
      container.appendChild(img);
    });
  };

  // Container setup with number of items per container
  const containers = [
    { container: document.getElementById('mapContainer'), itemsCount: 4 },
    { container: document.getElementById('mapContainer2'), itemsCount: 3 },
    { container: document.getElementById('mapContainer3'), itemsCount: 4 },
  ];

  let startIndex = 0;
  containers.forEach(({ container, itemsCount }) => {
    appendDraggablesToContainer(draggablesData.slice(startIndex, startIndex + itemsCount), container);
    startIndex += itemsCount;
  });

  // Handle drag and drop events with delegation
  const addDragEvents = () => {
    document.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('draggable')) {
        e.dataTransfer.setData('text/plain', e.target.id);
        e.target.style.opacity = '0';
      }
    });

    document.addEventListener('dragend', (e) => {
      if (e.target.classList.contains('draggable')) {
        e.target.style.opacity = '1';
      }
    });
  };

  // Drop area events
  const dropArea = document.getElementById('dropArea');
  const buttonCart = document.getElementById('btnCart');

  if (!dropArea || !buttonCart) {
    console.error('Drop area or cart button not found');
    return;
  }

  const handleDrop = (e) => {
    if (dropZoneItemCount < 3) {
      e.preventDefault();
      const id = e.dataTransfer.getData('text');
      const draggedElement = document.getElementById(id);

      if (!draggedElement || draggedElement.style.visibility === 'hidden') return;

      const clonedElement = draggedElement.cloneNode(true);
      clonedElement.style.opacity = '1';
      dropArea.appendChild(clonedElement);

      draggedElement.style.visibility = 'hidden';
      draggedElement.setAttribute('draggable', 'false');
      dropZoneItemCount++;

      dropArea.classList.remove('over');
      if (dropZoneItemCount === 3) {
        buttonCart.classList.add('visible');
      }
    }
  };

  dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('over');
  });

  dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('over');
  });

  dropArea.addEventListener('drop', handleDrop);

  // Cart button click event
  buttonCart.addEventListener('click', () => {
    window.location.href = 'https://lavka.yandex.ru/';
  });

  // Initialize drag events
  addDragEvents();
});
