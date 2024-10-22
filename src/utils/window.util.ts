export function addDraggableFeature(dialog: HTMLElement) {
  const header = dialog.querySelector(".dialog-header") as HTMLElement;
  let isDragging = false;
  let currentX: number;
  let currentY: number;
  let initialX: number;
  let initialY: number;
  let xOffset = 0;
  let yOffset = 0;

  function dragStart(e: MouseEvent) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
    if (e.target === header) {
      isDragging = true;
    }
  }

  function drag(e: MouseEvent) {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      xOffset = currentX;
      yOffset = currentY;
      setTranslate(currentX, currentY, dialog);
    }
  }

  function dragEnd(_: MouseEvent) {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
  }

  function setTranslate(xPos: number, yPos: number, el: HTMLElement) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
  }

  header.addEventListener("mousedown", dragStart);
  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", dragEnd);
}

export function addMinimizeFeature(dialog: HTMLElement) {
  const minimizeButton = dialog.querySelector('.minimize-button') as HTMLButtonElement;
  const dialogBody = dialog.querySelector('.dialog-body') as HTMLElement;
  let isMinimized = false;

  minimizeButton.addEventListener('click', () => {
    if (isMinimized) {
      dialogBody.style.display = 'block';
      minimizeButton.textContent = '-';
    } else {
      dialogBody.style.display = 'none';
      minimizeButton.textContent = '+';
    }
    isMinimized = !isMinimized;
  });
}