const gridContainer = document.getElementById('grid-container');
const gridContainerBackground = getComputedStyle(document.documentElement).getPropertyValue('--container-background');
const defaultDimensions = 16;
let colorMode = 'single-color';
let paintMode = 'standard';
const colorList = [
  '255,0,0', '165,42,42', '255,165,0',
  '255,255,0', '0,128,0', '0,255,255',
  '0,0,255', '128,0,128', '255,192,203',
  '128,128,128'
];
const toggleGridButton = document.getElementById('toggle-grid');
toggleGridButton.addEventListener('click', () => {
  cells.forEach(cell => cell.classList.toggle('show-hide-grid'));
});
const colorPaletteContainer = document.getElementById('palette');
const clickableColors = colorPaletteContainer.children;
let paintingColor = colorList[0];
const erase = document.getElementById('erase');

function enableErasing(event) {
  paintingColor = gridContainerBackground;
}
erase.addEventListener('click', enableErasing);

function setColor(colorClicked) {
  paintingColor = colorClicked.target.getAttribute('data-color');
  [...clickableColors].forEach(color => {
    if (color == colorClicked.target) {
      color.classList.add('active-color');
    } else {
      color.classList.remove('active-color');
    }
  });
}

function createColorPalette() {
  colorList.forEach(color => {
    const colorElement = document.createElement('div');
    colorElement.setAttribute('data-color', color);
    colorElement.style.backgroundColor = `rgb(${color})`;
    colorElement.classList.add('color-option');
    colorElement.addEventListener('click', setColor);
    colorPaletteContainer.appendChild(colorElement);
  });
}

createColorPalette();

function getRandomColor() {
  function randomizer() {
    return Math.floor(Math.random() * 256);
  }
  const color = `rgb(${randomizer()}, ${randomizer()}, ${randomizer()})`;
  return color;
}
function addColoringAbility() {
  cells.forEach(cell => cell.addEventListener('mouseover', fillCell));
}
function removeColoringAbility() {
  cells.forEach(cell => cell.removeEventListener('mouseover', fillCell));
}
function togglePrecisionMode(mouse) {
  if (mouse.buttons) {
    if (colorMode == 'pressure') increaseOpacity(mouse);
    else mouse.target.style.backgroundColor = `rgb(${paintingColor})`;
    cells.forEach(cell => cell.addEventListener('mouseover', fillCell));
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
  button.addEventListener('click', toggleModes);
});

const paintingModeButtons = document.querySelectorAll('.mode.painting');
paintingModeButtons.forEach(button => {
  button.addEventListener('click', toggleModes);
});

colorModeButtons[0].classList.add('active-mode');
paintingModeButtons[0].classList.add('active-mode');


/*OPACITY MODE FUNCTION*/

function increaseOpacity(hoveredCell) {
  const newOpacity = (
    (+hoveredCell.target.getAttribute('data-opacity') + 0.1)
      .toFixed(1)
  );
  hoveredCell.target.setAttribute('data-opacity', `${newOpacity}`);
  hoveredCell.target.style.backgroundColor = `rgba(${paintingColor},${newOpacity})`;
}

function fillCell(hoveredCell) {
    if (colorMode == 'single-color') {
      hoveredCell.target.style.backgroundColor = `rgb(${paintingColor})`;

    } else if (colorMode == 'picasso') {
      if (paintingColor == gridContainerBackground) {
        hoveredCell.target.style.backgroundColor = '';
      } else {
        hoveredCell.target.style.backgroundColor = getRandomColor();
      }
    } else {
      increaseOpacity(hoveredCell);
    }
}
let cells = '';
function createGrid(dimensions) {
  for (let i = 0; i < dimensions; i++) {
    const cell = document.createElement('div');
    cell.setAttribute('data-opacity', 0);
    cell.className = 'square';
    cell.addEventListener('mouseover', fillCell);
    gridContainer.appendChild(cell);
  }
  cells = [...gridContainer.children];
}

createGrid(defaultDimensions ** 2);

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
  resizeGrid();
  setPrecisionModeIfActive();
}

clearGridButton.addEventListener('click', clearGrid);








