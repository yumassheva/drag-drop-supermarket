document.addEventListener('DOMContentLoaded', () => {
  const draggablesData = [
    { id: 'draggable-1', src: './images/bottle.webp', alt: 'draggable 1' },
    { id: 'draggable-2', src: './images/milk.webp', alt: 'draggable 2' },
    { id: 'draggable-3', src: './images/jam.webp', alt: 'draggable 3' },
    { id: 'draggable-4', src: './images/cheese.webp', alt: 'draggable 4' },
    { id: 'draggable-5', src: './images/meat.webp', alt: 'draggable 5' },
    { id: 'draggable-6', src: './images/leg.webp', alt: 'draggable 6' },
    { id: 'draggable-7', src: './images/chips.webp', alt: 'draggable 7' },
    { id: 'draggable-8', src: './images/pineapple.webp', alt: 'draggable 8' },
    { id: 'draggable-9', src: './images/banana.webp', alt: 'draggable 9' },
    { id: 'draggable-10', src: './images/apple.webp', alt: 'draggable 10' },
    { id: 'draggable-11', src: './images/latuc.webp', alt: 'draggable 11' },
  ];

  let dropZoneItemCount = 0;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let draggedElement = null;

  const dropArea = document.getElementById('dropArea');
  const buttonCart = document.getElementById('btnCart');
  const containers = [
    document.getElementById('mapContainer'),
    document.getElementById('mapContainer2'),
    document.getElementById('mapContainer3')
  ];

  if (!dropArea || !buttonCart || !containers) {
    console.error('Drop area, cart button or containers not found');
    return;
  }

  const appendDraggablesToContainer = (draggables, container) => {
    if (!container) {
      console.error('Container not found');
      return;
    }
    draggables.forEach(({ id, src, alt }) => {
      const img = document.createElement('img');
      Object.assign(img, { id, src, alt, draggable: false, className: `draggable ${id}` });
      container.appendChild(img);
    });
  };

  let startIndex = 0;
  containers.forEach((container, index) => {
    const itemsCount = index === 0 ? 4 : index === 1 ? 3 : 4;
    appendDraggablesToContainer(draggablesData.slice(startIndex, startIndex + itemsCount), container);
    startIndex += itemsCount;
  });

  const blockScroll = () => {
    document.body.classList.add('no-scroll');
  };

  const unblockScroll = () => {
    document.body.classList.remove('no-scroll');
  };

  const isWithinDropZone = (x, y) => {
    const dropAreaRect = dropArea.getBoundingClientRect();
    return (
      x >= dropAreaRect.left &&
      x <= dropAreaRect.right &&
      y >= dropAreaRect.top &&
      y <= dropAreaRect.bottom
    );
  };

  const handleMouseDrag = (container) => {
    container.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('draggable') && dropZoneItemCount < 3) {
        draggedElement = e.target;
        blockScroll();

        const rect = draggedElement.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;

        draggedElement.style.opacity = '0.5';

        const mouseMoveHandler = (moveEvent) => {
          const newLeft = moveEvent.clientX - dragOffsetX;
          const newTop = moveEvent.clientY - dragOffsetY;

          let dragClone = document.getElementById('drag-clone');
          if (!dragClone) {
            dragClone = draggedElement.cloneNode(true);
            dragClone.id = 'drag-clone';
            dragClone.style.position = 'absolute';
            dragClone.style.zIndex = '1000';
            document.body.appendChild(dragClone);
          }
          dragClone.style.left = `${newLeft}px`;
          dragClone.style.top = `${newTop}px`;
        };

        const mouseUpHandler = (upEvent) => {
          const dragClone = document.getElementById('drag-clone');
          if (dragClone) {
            if (isWithinDropZone(upEvent.clientX, upEvent.clientY)) {
              handleDropForMouse(draggedElement);
            }

            draggedElement.style.opacity = '0';
            dragClone.remove();
          }

          unblockScroll();
          document.removeEventListener('mousemove', mouseMoveHandler);
          document.removeEventListener('mouseup', mouseUpHandler);
          draggedElement = null;
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
      }
    });
  };

  const handleTouchDrag = (container) => {
    container.addEventListener('touchstart', (e) => {
      if (e.target.classList.contains('draggable') && dropZoneItemCount < 3) {
        draggedElement = e.target;
        blockScroll();

        const touch = e.touches[0];
        const rect = draggedElement.getBoundingClientRect();
        dragOffsetX = touch.clientX - rect.left;
        dragOffsetY = touch.clientY - rect.top;

        draggedElement.style.opacity = '0.5';
      }
    });

    container.addEventListener('touchmove', (e) => {
      if (draggedElement) {
        const touch = e.touches[0];
        const newLeft = touch.clientX - dragOffsetX;
        const newTop = touch.clientY - dragOffsetY;

        let dragClone = document.getElementById('drag-clone');
        if (!dragClone) {
          dragClone = draggedElement.cloneNode(true);
          dragClone.id = 'drag-clone';
          dragClone.style.position = 'absolute';
          dragClone.style.zIndex = '1000';
          document.body.appendChild(dragClone);
        }
        dragClone.style.left = `${newLeft}px`;
        dragClone.style.top = `${newTop}px`;
      }
    });

    container.addEventListener('touchend', (e) => {
      if (draggedElement) {
        const touch = e.changedTouches[0];

        if (isWithinDropZone(touch.clientX, touch.clientY)) {
          handleDropForTouch(draggedElement);
        }

        draggedElement.style.opacity = '0';

        const dragClone = document.getElementById('drag-clone');
        if (dragClone) {
          dragClone.remove();
        }
        unblockScroll();
        draggedElement = null;
      }
    });
  };

  const handleDropForMouse = (element) => {
    if (dropZoneItemCount < 3) {
      const clonedElement = element.cloneNode(true);

      clonedElement.style.position = 'relative';
      clonedElement.style.left = '0';
      clonedElement.style.top = '0';
      clonedElement.style.opacity = '1';

      dropArea.appendChild(clonedElement);

      element.style.opacity = '0';
      element.style.pointerEvents = 'none';
      dropZoneItemCount++;

      if (dropZoneItemCount === 3) {
        buttonCart.classList.add('visible');
        blockDraggables();
      }
    }
  };

  const handleDropForTouch = (element) => {
    handleDropForMouse(element);
  };

  const blockDraggables = () => {
    const draggables = document.querySelectorAll('.draggable');
    draggables.forEach(draggable => {
      draggable.style.pointerEvents = 'none';
      draggable.style.userSelect = 'none';
      draggable.style.opacity = '1';
    });
    const stand = document.querySelectorAll('.stand-box');
    stand.forEach(draggable => {
      draggable.style.pointerEvents = 'none';
      draggable.style.userSelect = 'none';
      draggable.style.opacity = '0.7';
    });
  };

  buttonCart.addEventListener('click', () => {
    window.location.href = 'https://lavka.yandex.ru/';
  });

  containers.forEach(container => {
    handleMouseDrag(container);
    handleTouchDrag(container);
  });
});