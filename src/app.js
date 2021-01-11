/**
 * TODO
 * - Github repo
 * - add and remove buttons for lists and cards
 * - input fields, basic card screen
 * - Threshold width/height value when drag sorting elements
 * - BONUS: sexy shuffle animations???
 */

const draggables = document.querySelectorAll('.draggable'); 
const containers = document.querySelectorAll('.container');

window.addEventListener('mousemove', e => {
  moveGhost(e.pageX, e.pageY);
});

window.addEventListener('mouseup', e => {
  let draggable = document.querySelector('.dragging');
  if (draggable != null) {
    draggable.classList.remove('dragging');
    document.body.removeChild(document.querySelector('.drag-ghost'));
  }
});

draggables.forEach(draggable => {
  draggable.addEventListener('mousedown', e => {
    e.preventDefault();
    e.stopPropagation();
    let safeToDrag = false;
    if (draggable.classList.contains('listwrapper')) {
      const h = draggable.querySelector('.list-header');
      if ($(h).is(':hover')) {
        safeToDrag = true;
      }
    } else {
      safeToDrag = true;
    }
    if (safeToDrag) {
      const box = draggable.getBoundingClientRect();
      let ghost = draggable.cloneNode(true);
      ghost.style.position = 'absolute';
      ghost.setAttribute('data-offset-x', e.clientX - box.left); 
      ghost.setAttribute('data-offset-y', e.clientY - box.top); 
      ghost.classList.add('drag-ghost');
      document.body.append(ghost);
      moveGhost(e.pageX, e.pageY);
      draggable.classList.add('dragging'); 
    }
  });
});

containers.forEach(container => {
  container.addEventListener('mouseover', e => {
    e.stopPropagation();
    const draggable = document.querySelector('.dragging'); 
    if (draggable != null && dropAreaValid(container.dataset.droptypes, draggable.classList)) {
      const afterElement = container.classList.contains('container-vertical') ?
      getDragAfterElement(container, e.clientY, calcDragAfterElementOffsetY) : 
      getDragAfterElement(container, e.clientX, calcDragAfterElementOffsetX);
      if (afterElement == null && draggable != null) {
        container.appendChild(draggable);
      } else if (draggable != null) {
        container.insertBefore(draggable, afterElement);
      }
    }
  });
});

function getDragAfterElement(container, coord, offsetFunction) {
  const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = offsetFunction(coord, box);
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child }; 
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function calcDragAfterElementOffsetY(y, box) {
  return y - box.top - box.height / 2;
}

function calcDragAfterElementOffsetX(x, box) {
  return x - box.left - box.width / 2;
}

function dropAreaValid(droptypes, draggableClasses) {
  let valid = false;
  if (draggableClasses.contains('draggable')) { //if !draggable, return false by default 
    droptypes.split(' ').forEach(type => {
      if (draggableClasses.contains(type)) {
        valid = true;
      }
    });
  }
  return valid;
}

function moveGhost(xx, yy) {
  const ghost = document.querySelector('.drag-ghost');
  if (ghost != null) {
    ghost.style.left = (xx - parseInt(ghost.getAttribute('data-offset-x'))) + 'px';
    ghost.style.top = (yy - parseInt(ghost.getAttribute('data-offset-y'))) + 'px';
  }
}