document.addEventListener('DOMContentLoaded', () => {
  const userGrid = document.querySelector('.grid-user');
  const computerGrid = document.querySelector('.grid-computer');
  const displayGrid = document.querySelector('.grid-display');
  const ships = document.querySelectorAll('.ship');
  const destroyer = document.querySelector('.destroyer-container');
  const submarine = document.querySelector('.submarine-container');
  const cruiser = document.querySelector('.cruiser-container');
  const battleship = document.querySelector('.battleship-container');
  const carrier = document.querySelector('.carrier-container');
  const startButton = document.querySelector('#start');
  const rotateButton = document.querySelector('#rotate');
  const turnDisplay = document.querySelector('#whose-go');
  const infoDisplay = document.querySelector('#info');
  const userSquares = [];
  const computerSquares = [];
  let isHorizontal = true;

  const width = 10;

  // Create the user and the computer boards
  function createBoard(grid, squares) {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement('div');
      square.dataset.id = i; // we give each square an id
      grid.appendChild(square);
      squares.push(square);
    }
  }

  createBoard(userGrid, userSquares);
  createBoard(computerGrid, computerSquares);

  // Randomly generate ships in the computer grid
  // Ships
  const shipArray = [
    {
      name: 'destroyer',
      directions: [
        [0, 1], // divs with ids 0 and 1 if we paint the ship horizontally
        [0, width], // divs with ids 0 and 10 if we paint the ship vertically
      ],
    },
    {
      name: 'submarine',
      directions: [
        [0, 1, 2], // divs with ids 0, 1 and 2 if we paint the ship horizontally
        [0, width, width * 2], // // divs with ids 0, 10 and 20 if we paint the ship vertically
      ],
    },
    {
      name: 'cruiser',
      directions: [
        [0, 1, 2], // divs with ids 0, 1 and 2 if we paint the ship horizontally
        [0, width, width * 2], // divs with ids 0, 10 and 20 if we paint the ship verically
      ],
    },
    {
      name: 'battleship',
      directions: [
        [0, 1, 2, 3], // divs with ids 0, 1, 2 and 3 if we paint the ship horizontally
        [0, width, width * 2, width * 3], // divs with ids 0, 10, 20 and 30 if we paint the ship vertically
      ],
    },
    {
      name: 'carrier',
      directions: [
        [0, 1, 2, 3, 4], // divs with ids 0, 1, 2, 3 and 4 if we paint the ship horizontally
        [0, width, width * 2, width * 3, width * 4], // divs with ids 0, 10, 20, 30 and 40 if we paint the ship vertically
      ],
    },
  ];

  // Draw each of the computer's ships in a random location
  function generate(ship) {
    // first we'll get a random direction, either vertical or horizontal
    let randomDirection = Math.floor(Math.random() * ship.directions.length); // the 'Math.random() * 2' is either going to be 0 or 1
    let current = ship.directions[randomDirection]; // we grab the ship's direction array
    if (randomDirection === 0) direction = 1;
    if (randomDirection === 1) direction = 10;

    // second we want to select a random start to paint our ship
    let randomStart = Math.abs(
      Math.floor(
        Math.random() * computerSquares.length -
          ship.directions[0].length * direction
      )
    ); // 'Math.random() * computerSquares.length' gives us a random number from 0 to 99, but we want to make sure we don't spill out of the grid when we paint the ship hence we need to subtract 'ship.directions[0].length * direction'

    // and we need to make sure the square we want to go in is not already taken
    const isTaken = current.some((index) =>
      computerSquares[randomStart + index].classList.contains('taken')
    );
    // test if we are at left edge
    const isAtRightEdge = current.some(
      (index) => (randomStart + index) % width === width - 1
    );
    // test is we are at right edge
    const isAtLeftEdge = current.some(
      (index) => (randomStart + index) % width === 0
    );
    // place ship
    if (!isTaken && !isAtRightEdge && !isAtLeftEdge) {
      current.forEach((index) =>
        computerSquares[randomStart + index].classList.add('taken', ship.name)
      );
    } else {
      generate(ship);
    }
  }

  // generate & place computer ships
  generate(shipArray[0]);
  generate(shipArray[1]);
  generate(shipArray[2]);
  generate(shipArray[3]);
  generate(shipArray[4]);

  // rotate the user's ships
  function rotate() {
    if (isHorizontal) {
      destroyer.classList.toggle('destroyer-container-vertical');
      submarine.classList.toggle('submarine-container-vertical');
      cruiser.classList.toggle('cruiser-container-vertical');
      battleship.classList.toggle('battleship-container-vertical');
      carrier.classList.toggle('carrier-container-vertical');
      isHorizontal = false;
      console.log(isHorizontal);
      return;
    }
    if (!isHorizontal) {
      destroyer.classList.toggle('destroyer-container-vertical');
      submarine.classList.toggle('submarine-container-vertical');
      cruiser.classList.toggle('cruiser-container-vertical');
      battleship.classList.toggle('battleship-container-vertical');
      carrier.classList.toggle('carrier-container-vertical');
      isHorizontal = true;
      console.log(isHorizontal);
      return;
    }
  }
  rotateButton.addEventListener('click', rotate);

  // move around the user's ships
  ships.forEach((ship) => ship.addEventListener('dragstart', dragStart));
  userSquares.forEach((square) =>
    square.addEventListener('dragstart', dragStart)
  );
  userSquares.forEach((square) =>
    square.addEventListener('dragover', dragOver)
  );
  userSquares.forEach((square) =>
    square.addEventListener('dragenter', dragEnter)
  );
  userSquares.forEach((square) =>
    square.addEventListener('dragleave', dragLeave)
  );
  userSquares.forEach((square) => square.addEventListener('drop', dragDrop));
  userSquares.forEach((square) => square.addEventListener('dragend', dragEnd));

  // declare some useful variables
  let selectedShipNameWithIndex;
  let draggedShip;
  let draggedShipDivsArray;
  let draggedShipLength;

  // grab id of whichever ship we are dragging
  ships.forEach((ship) =>
    ship.addEventListener('mousedown', (e) => {
      selectedShipNameWithIndex = e.target.id;
      console.log('selectedShipNameWithIndex', selectedShipNameWithIndex); // returns for ex 'submarine-1' - depends where the mouse grabbed the ship
    })
  );

  function dragStart() {
    draggedShip = this;
    console.log('draggedShip', draggedShip); // returns this entire div ship container with its div squares inside
    draggedShipDivsArray = draggedShip.getElementsByTagName('div'); // get array of div square inside entire div ship container
    console.log('draggedShipDivsArray', draggedShipDivsArray);
    draggedShipLength = draggedShipDivsArray.length; // count how many divs are in the ship container that was grabbed
    console.log('draggedShipLength', draggedShipLength);
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function dragEnter(e) {
    e.preventDefault();
  }

  function dragLeave(e) {
    e.preventDefault();
  }

  function dragDrop() {
    // get the last child's id (last div's id of all the divs that are in the ship container we dragged)
    let shipNameWithLastId = draggedShipDivsArray[draggedShipLength - 1].id;
    console.log('shipNameWithLastId', shipNameWithLastId);
    // get ship category (destroyer, submarine, etc.)
    let shipClass = shipNameWithLastId.slice(0, -2);
    console.log('shipClass', shipClass);
    // get the id of the last square on the grid where our ship is going to be
    let lastShipIndex = parseInt(shipNameWithLastId.substr(-1)); // we want the last item in our string and transform it into an int
    console.log('lastShipIndex', lastShipIndex);

    // get the id of last div on user grid where selected ship will land
    let shipLastGridId = lastShipIndex + parseInt(this.dataset.id);
    console.log('this.dataset.id', this.dataset.id);
    selectedShipIndex = parseInt(shipNameWithLastId.substr(-1)); // gives the index of the div square where our mouse landed on the ship we grabbed
    shipLastGridId = shipLastGridId - selectedShipIndex; // gives the last id on user grid where ship will land
    console.log('shipLastGridId', shipLastGridId);

    if (isHorizontal) {
      for (let i = 0; i < draggedShipLength; i++) {
        userSquares[
          parseInt(this.dataset.id) - selectedShipIndex + i
        ].classList.add('taken', shipClass);
      }
    } else if (!isHorizontal) {
      for (let i = 0; i < draggedShipLength; i++) {
        userSquares[
          parseInt(this.dataset.id) - selectedShipIndex + width * i
        ].classList.add('taken', shipClass);
      }
    } else return;

    // remove ship from display grid once it's been placed
    displayGrid.removeChild(draggedShip);
  }

  function dragEnd() {}
});
