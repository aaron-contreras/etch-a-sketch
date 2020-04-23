const gridContainer = document.getElementById('grid-container');
const defaultDimensions = 16;
let opacity = 0;
let colorMode = 'single-color';
let paintMode = 'standard';

function getRandomColor() {
  function randomizer() {
    return Math.floor(Math.random() * 256);
  }
  const color = `rgb(${randomizer()}, ${randomizer()}, ${randomizer()})`;
  return color;
}
function addColoringAbility() {
  cells.forEach(cell => cell.addEventListener('mouseover', colorCellStandard));
}
function removeColoringAbility() {
  cells.forEach(cell => cell.removeEventListener('mouseover', colorCellStandard));
}
function togglePrecisionMode(mouse) {
  if (mouse.buttons) {
    mouse.target.style.backgroundColor = 'orange';
    cells.forEach(cell => cell.addEventListener('mouseover', colorCellStandard));
    mouse.preventDefault();
  } else {
    removeColoringAbility();
  }
}
function setPrecisionModeIfActive() {
  if (paintMode == 'precision') {
    removeColoringAbility();
    gridContainer.addEventListener('mousedown', togglePrecisionMode);
    gridContainer.addEventListener('mouseup', togglePrecisionMode);
    
  } else {
    addColoringAbility();
    gridContainer.removeEventListener('mousedown', togglePrecisionMode);
    gridContainer.removeEventListener('mouseup', togglePrecisionMode);
  }
}
function toggleModes(event) {
  if ([...event.target.classList].includes('painting')) {
    paintMode = event.target.id;
    setPrecisionModeIfActive();
    paintingModeButtons.forEach(button => {
      if (button == event.target) {
        button.classList.add('active-mode');
      } else {
        button.classList.remove('active-mode');
      }
    });
  } else {
    colorMode = event.target.id;
    colorModeButtons.forEach(button => {
      if (button == event.target) {
        button.classList.add('active-mode');
      } else {
        button.classList.remove('active-mode');
      }
    });
  }
}
const colorModeButtons = document.querySelectorAll('.mode.color');
colorModeButtons.forEach(button => {
  console.log(button);
  button.addEventListener('click', toggleModes);
});

const paintingModeButtons = document.querySelectorAll('.mode.painting');
paintingModeButtons.forEach(button => {
  console.log(button);
  button.addEventListener('click', toggleModes);
});

/*OPACITY MODE FUNCTION*/

function increaseOpacity(hoveredCell) {
  const newOpacity = (
    (+hoveredCell.target.getAttribute('data-opacity') + 0.1)
      .toFixed(1)
  );
  hoveredCell.target.setAttribute('data-opacity', `${newOpacity}`);
  hoveredCell.target.style.backgroundColor = `rgba(0,0,0,${hoveredCell.target.getAttribute('data-opacity')})`;
}

function colorCellStandard(hoveredCell) {
  console.log(colorMode);
  if (colorMode == 'single-color') {
    hoveredCell.target.classList.add('hovered');
  } else if (colorMode == 'picasso') {
    hoveredCell.target.style.setProperty('background-color', getRandomColor());
  } else {
    increaseOpacity(hoveredCell);
  }
}

function createGrid(dimensions) {
  for (let i = 0; i < dimensions; i++) {
    const cell = document.createElement('div');
    cell.setAttribute('data-opacity', 0);
    cell.className = 'square';
    cell.addEventListener('mouseover', colorCellStandard);
    gridContainer.appendChild(cell);
  }
}

createGrid(defaultDimensions ** 2);
const cells = [...gridContainer.children];
const clearGridButton = document.getElementById('clear');

function askNewGridSize() {
  let newDimensions;
  do {
    newDimensions = prompt('Grid density for new board (1 to 64)?\nNot entering a number will default to 16.') || defaultDimensions;
  } while (newDimensions < 1 || newDimensions > 64);

  return newDimensions;
}

function resizeGrid() {
  dimensions = askNewGridSize();
  gridContainer.style.setProperty(
    'grid-template-columns', `repeat(${dimensions}, calc(100% / ${dimensions})`
  );
  gridContainer.style.setProperty(
    'grid-template-rows', `repeat(${dimensions}, calc(100% / ${dimensions})`
  );
  gridContainer.innerHTML = '';
  createGrid(dimensions ** 2);
}

function clearGrid() {
  cells.forEach(cell => cell.classList.remove('hovered'));
  resizeGrid();
}

clearGridButton.addEventListener('click', clearGrid);








