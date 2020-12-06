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

  const nbSquares = 10; // grids are 10 squares x 10 squares

  // Ships
  const shipArray = [
    {
      name: 'destroyer',
      directions: [
        [0, 1], // divs with ids 0 and 1 if we paint the ship horizontally
        [0, nbSquares], // divs with ids 0 and 10 if we paint the ship vertically
      ],
    },
    {
      name: 'submarine',
      directions: [
        [0, 1, 2], // divs with ids 0, 1 and 2 if we paint the ship horizontally
        [0, nbSquares, nbSquares * 2], // // divs with ids 0, 10 and 20 if we paint the ship vertically
      ],
    },
    {
      name: 'cruiser',
      directions: [
        [0, 1, 2], // divs with ids 0, 1 and 2 if we paint the ship horizontally
        [0, nbSquares, nbSquares * 2], // divs with ids 0, 10 and 20 if we paint the ship verically
      ],
    },
    {
      name: 'battleship',
      directions: [
        [0, 1, 2, 3], // divs with ids 0, 1, 2 and 3 if we paint the ship horizontally
        [0, nbSquares, nbSquares * 2, nbSquares * 3], // divs with ids 0, 10, 20 and 30 if we paint the ship vertically
      ],
    },
    {
      name: 'carrier',
      directions: [
        [0, 1, 2, 3, 4], // divs with ids 0, 1, 2, 3 and 4 if we paint the ship horizontally
        [0, nbSquares, nbSquares * 2, nbSquares * 3, nbSquares * 4], // divs with ids 0, 10, 20, 30 and 40 if we paint the ship vertically
      ],
    },
  ];

  // Create the user and the computer boards
  function createBoard(grid, squares) {
    for (let i = 0; i < nbSquares * nbSquares; i++) {
      const square = document.createElement('div');
      square.dataset.id = i; // we give each square an id
      grid.appendChild(square);
      squares.push(square);
    }
  }

  createBoard(userGrid, userSquares);
  createBoard(computerGrid, computerSquares);

  // Draw each of the computer's ships in a random location
  function generate(ship) {
    // first we'll get a random direction, either vertical or horizontal
    let randomDirection = Math.floor(Math.random() * ship.directions.length); // the 'Math.random() * 2' is either going to be 0 or 1
    let current = ship.directions[randomDirection]; // we grab the ship's direction array
    if (randomDirection === 0) countBy = 1;
    if (randomDirection === 1) countBy = 10;

    // second we want to select a random start to paint our ship
    let randomStart = Math.abs(
      Math.floor(
        Math.random() * computerSquares.length -
          ship.directions[0].length * countBy
      )
    ); // 'Math.random() * computerSquares.length' gives us a random number from 0 to 99, but we want to make sure we don't spill out of the grid when we paint the ship hence we need to subtract 'ship.directions[0].length * direction'

    // and we need to make sure the square we want to go in is not already taken
    const isTaken = current.some((index) =>
      computerSquares[randomStart + index].classList.contains('taken')
    );
    // test if we are at right edge
    const isAtRightEdge = current.some(
      (index) => (randomStart + index) % nbSquares === nbSquares - 1
    );
    // test is we are at left edge
    const isAtLeftEdge = current.some(
      (index) => (randomStart + index) % nbSquares === 0
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
      return;
    }
    if (!isHorizontal) {
      destroyer.classList.toggle('destroyer-container-vertical');
      submarine.classList.toggle('submarine-container-vertical');
      cruiser.classList.toggle('cruiser-container-vertical');
      battleship.classList.toggle('battleship-container-vertical');
      carrier.classList.toggle('carrier-container-vertical');
      isHorizontal = true;
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
      selectedShipNameWithIndex = e.target.id; // returns for ex 'submarine-1' - depends where the mouse grabbed the ship
    })
  );

  function dragStart() {
    draggedShip = this; // get the entire div ship container with its div squares inside
    draggedShipDivsArray = draggedShip.getElementsByTagName('div'); // get array of div square inside entire div ship container
    draggedShipLength = draggedShipDivsArray.length; // count how many divs are in the ship container that was grabbed
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
    // get ship category (destroyer, submarine, etc.)
    let shipClass = shipNameWithLastId.slice(0, -2);
    // get ship's last div id
    let lastShipIndex = parseInt(shipNameWithLastId.substr(-1));
    // get the index of the div square where our mouse landed on the ship we grabbed
    let selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1));
    // get the grid id where the ship's last div will land if horizontal
    let gridIdShipLastDivHorizontal =
      parseInt(this.dataset.id) + lastShipIndex - selectedShipIndex;
    // get the grid id where the ship's last div will land if vertical
    let gridIdShipLastDivVertical =
      parseInt(this.dataset.id) +
      lastShipIndex * nbSquares -
      selectedShipIndex * nbSquares;

    // determine off-limit divs for ships placed horizontally
    const notAllowedHorizontal = [
      10,
      20,
      30,
      40,
      50,
      60,
      70,
      80,
      90,
      100,
      11,
      21,
      31,
      41,
      51,
      61,
      71,
      81,
      91,
      101,
      2,
      12,
      22,
      32,
      42,
      52,
      62,
      72,
      82,
      92,
      102,
      3,
      13,
      23,
      33,
      43,
      53,
      63,
      73,
      83,
      93,
      103,
    ];
    let newNotAllowedHorizontal = notAllowedHorizontal.splice(
      0,
      10 * lastShipIndex
    );

    // determine off-limit divs for ships placed vertically
    const notAllowedVertical = [
      99,
      98,
      97,
      96,
      95,
      94,
      93,
      92,
      91,
      90,
      89,
      88,
      87,
      86,
      85,
      84,
      83,
      82,
      81,
      80,
      79,
      78,
      77,
      76,
      75,
      74,
      73,
      72,
      71,
      70,
      69,
      68,
      67,
      66,
      65,
      64,
      63,
      62,
      61,
      60,
    ];
    let newNotAllowedVertical = notAllowedVertical.splice(
      0,
      10 * lastShipIndex
    );

    if (
      isHorizontal &&
      !newNotAllowedHorizontal.includes(gridIdShipLastDivHorizontal)
    ) {
      for (let i = 0; i < draggedShipLength; i++) {
        userSquares[
          parseInt(this.dataset.id) - selectedShipIndex + i
        ].classList.add('taken', shipClass);
      }
    } else if (
      !isHorizontal &&
      !newNotAllowedVertical.includes(gridIdShipLastDivVertical)
    ) {
      for (let i = 0; i < draggedShipLength; i++) {
        userSquares[
          parseInt(this.dataset.id) -
            nbSquares * selectedShipIndex +
            nbSquares * i
        ].classList.add('taken', shipClass);
      }
    } else return;

    // remove ship from display grid once it's been placed
    displayGrid.removeChild(draggedShip);
  }

  function dragEnd() {}
});
