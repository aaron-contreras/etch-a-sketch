const gridContainer = document.getElementById('grid-container');
const defaultDimensions = 16;


function getRandomColor() {
  function randomizer() {
    return Math.floor(Math.random() * 256);
  }
  const color = `rgb(${randomizer()}, ${randomizer()}, ${randomizer()})`;
  return color;
}

function colorCell(hoveredCell) {
  // stylesheet single color mode
  hoveredCell.target.classList.add('hovered');
  // random color mode
  hoveredCell.target.style.setProperty('background-color', getRandomColor());
}

function createGrid(dimensions) {
  for (let i = 0; i < dimensions; i++) {
    const cell = document.createElement('div');
    cell.className = 'square';
    cell.addEventListener('mouseover', colorCell);
    gridContainer.appendChild(cell);
  }
}

createGrid(defaultDimensions ** 2);
const cells = [...gridContainer.children];
const clearGridButton = document.getElementById('clear');

function askNewGridSize() {
  let newDimensions = 16;
  do {
    newDimensions = prompt('Grid density for new board (1 to 64)?\nNot entering a number will default to 16.') || defaultDimensions;
  } while(newDimensions < 1 || newDimensions > 64);

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








