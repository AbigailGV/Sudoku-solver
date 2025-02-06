document.addEventListener('DOMContentLoaded', function(){
    const gridsize = 9;
    const solveButton = document.getElementById("solve-btn");

    solveButton.addEventListener('click', solveSudoku);
    const sudokuGrid = document.getElementById("sudoku-grid");
    
    // Creation of the sudoku grid and its cells
    for(let row = 0; row < gridsize; row++){
        const sudokuRow = document.createElement("tr");
        for(let column = 0; column < gridsize; column++){
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.className = "cell";
            input.id = `cell-${row}-${column}`;
            // Cell containing the input
            cell.appendChild(input);
            // Rows containing cells
            sudokuRow.appendChild(cell);
        }
        // After creating a sudoku row
        // The sudokuGrid has to contain the created row
        sudokuGrid.appendChild(sudokuRow);
    }
});

async function solveSudoku() {
    const gridsize = 9;
    const sudokuArray = [];

    // Fill the sudokuArray with input values from the grid
    for(let row = 0; row < gridsize; row++){
        // Creates 9 void arrays inside the "sudokyArray"
        sudokuArray[row] = []; // [[]]
        for(let column = 0; column < gridsize; column++){
            const cellId = `cell-${row}-${column}`;
            const cellValue = document.getElementById(cellId).value;
            // Ternary operator -->  condition ? true : false
            sudokuArray[row][column] = cellValue !== "" ? parseInt (cellValue) : 0;
        }
    }
    // Identify user inputs and mark them
    for(let row = 0; row < gridsize; row++){
        for(let column = 0; column < gridsize; column++){
            const cellId = `cellId-${row}-${column}`;
            const cell = document.getElementById(cellId);

            if(sudokuArray[row][column] !== 0){
                // Marking the user inputs by creating a class and adding it to "cell" classList
                cell.classList.add("user-input");
            }
        }
    }
    // Solve the sudoku and display solution
    if(solveSudokuHelper(sudokuArray)){
        for(let row = 0; row < gridsize; row++){
            for(let column = 0; column < gridsize; column++){
                const cellId = `cell-${row}-${column}`;
                const cell = document.getElementById(cellId);

                // Fill all the solved values excluding user input and apply animation
                if (!cell.classList.contains("user-input")) {
                    cell.value = sudokuArray[row][column];
                    cell.classList.add("solved");
                    // A little delay for visualization
                    await sleep(20); 
                }
            }
        }
    }else{
        alert("There is no solution for the given Sudoku puzzle!");
    }
}

function solveSudokuHelper(board){
    const gridsize = 9;

    for(let row = 0; row < gridsize; row++){
        for(let column = 0; column < gridsize; column++){
            if(board[row][column] === 0){
                for(let num = 1; num <=9; num++){
                    if(isValidMove(board, row, column, num)){
                        board[row][column] = num;

                        // Use recursion to solve the sudoku    
                        if(solveSudokuHelper(board)){
                            // Puzzle solved
                            return true; 
                        }
                        // Backtrack    
                        board[row][column] = 0;
                    }
                }
                // User input
                return false; 
            }
        }
    }
    // All cells filled
    return true;
}

function isValidMove(board, row, column, num){
    const gridsize = 9;

    // Check rows and columns for conflicts
    for(let i = 0; i < gridsize; i++){
        if(board[row][i] === num || board[i][column] === num){
            // There is a conflict
            return false;
        }
    }
    // Check the 3*3 sub grids
    const startRow = Math.floor(row / 3) * 3;
    const startColumn = Math.floor(column / 3) * 3;

    for(let i = startRow; i < startRow + 3; i++){
        for(let j = startColumn; j < startColumn + 3; j++){
            if(board[i][j] === num){
                // Conflict
                return false;
            }
        }
    }
    // No conflicts were founded
    return true;
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}