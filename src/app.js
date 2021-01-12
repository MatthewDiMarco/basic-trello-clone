$(document).ready(init);

function init() {
  const boardbutton = document.querySelector('.board-btn'); 
  const trashbutton = document.querySelector('.trash-btn');
  const listcontainer = document.querySelector('.container-horizontal');

  //$('body, html').mousedown(function(e) { e.preventDefault(); });

  boardbutton.addEventListener('click', e => {
    createList(listcontainer);
  }); 
  
  trashbutton.addEventListener('mouseup', e => {
    let draggable = document.querySelector('.dragging');
    if (draggable != null) {
      $(draggable).remove();
      document.body.removeChild(document.querySelector('.drag-ghost'));
    }
  });

  listcontainer.addEventListener('mouseover', e => {
    containerMouseOverHandler(listcontainer, e);
  });

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

  createList(listcontainer);
}

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

function createList(container) {
  const listWrapper = document.createElement('div');
  const listContent = document.createElement('div');
  const listHeader = document.createElement('div');
  const listCards = document.createElement('div');
  const listBtn = document.createElement('div');
  const listBtnTxt = document.createElement('div');

  listWrapper.classList = 'draggable listwrapper';
  listContent.classList = 'list-content';
  listHeader.classList = 'list-header';
  listHeader.innerHTML = 'List';
  listCards.classList = 'container container-vertical list-cards';
  listCards.setAttribute('data-droptypes', 'card'); 
  listBtn.classList = 'btn list-btn';
  listBtnTxt.classList = 'btn-text';
  listBtnTxt.innerHTML = '+ Add card';

  listWrapper.addEventListener('mousedown', e => {
    draggableMouseDownHandler(listWrapper, e);
  });

  listCards.addEventListener('mouseover', e => {
    containerMouseOverHandler(listCards, e); 
  });

  listBtn.addEventListener('click', e => {
    createCard(listCards);
  });

  listContent.appendChild(listHeader);
  listContent.appendChild(listCards);
  listBtn.appendChild(listBtnTxt);
  listContent.appendChild(listBtn);
  listWrapper.appendChild(listContent);

  container.appendChild(listWrapper);
}

function createCard(container) {
  const cardDiv = document.createElement('div');

  cardDiv.classList = 'draggable card';
  cardDiv.innerHTML = 'Card';

  cardDiv.addEventListener('mousedown', e => {
    draggableMouseDownHandler(cardDiv, e);
  });

  container.appendChild(cardDiv);
}

function draggableMouseDownHandler(draggable, e) {
  e.preventDefault();
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
}

function containerMouseOverHandler(container, e) {
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
}