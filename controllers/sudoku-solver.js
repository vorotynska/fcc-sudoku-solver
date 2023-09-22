class SudokuSolver {

  validate(puzzleString, solver = false) {
    if (!solver) {
      if (!puzzleString) {
        return "c";
      }
    } else if (solver) {
      // When validation is called from the solve function. Strings are different according to user stories, but seems redunant (as the error messages say the exact same thing).
      if (!puzzleString) {
        return "g";
      }
    }

    const puzzleArray = puzzleString.split("");

    // Check that string contains digits and/or dots. Return error if not.
    // Check length of string. Return error if wrong length.
    var regex = /^[\d|\.]{81}$/;
    if (!regex.test(puzzleString)) {
      const puzzleLen = puzzleString.length;
      if (puzzleLen < 81 || puzzleLen > 81) {
        return "b";
      }
      return "a";
    }

    // Check that the given numbers aren't conflicting.
    for (var i = 0; i < puzzleArray.length; i++) {
      if (puzzleArray[i] !== ".") {
        let row = Math.floor(i / 9);
        let col = i % 9;
        if (!this.checkOne(puzzleString, row, col, puzzleArray[i])) {
          return "f";
        }
      }
    }

    return;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const puzzleArray = puzzleString.split("");
    const startIndex = (row % 9) * 9;
    const sameValIndex = startIndex + column;
    for (var i = startIndex; i <= startIndex + 8; i++) {
      if (i === sameValIndex) {
        continue;
      }
      if (puzzleArray[i] == value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const puzzleArray = puzzleString.split("");
    const startIndex = column;
    const sameValIndex = (row % 9) * 9 + column;
    for (var i = startIndex; i <= 80; i += 9) {
      if (i === sameValIndex) {
        continue;
      }
      if (puzzleArray[i] == value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const puzzleArray = puzzleString.split("");
    const startRow = row - (row % 3);
    const startCol = column - (column % 3);
    const startIndex = startRow * 9 + startCol;
    const sameValIndex = (row % 9) * 9 + column;
    for (var i = startIndex; i <= startIndex + 20; i += 9) {
      for (var j = i; j <= i + 2; j++) {
        if (j === sameValIndex) {
          continue;
        }
        if (puzzleArray[j] == value) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString, x = 0) {
    const validation = this.validate(puzzleString, true); // Note that second param is true.
    if (validation) {
      return validation;
    } else {
      const solution = this.executeSolve(puzzleString.split(""), x);
      if (/\./g.test(solution)) {
        return "f";
      }
      return solution.join("");
    }
  }

  executeSolve(puzzleArray, x = 0) {
    // Abort recursion on a depth of 6 and call the puzzle unsolvable, although that might not be true.
    if (x > 7) {
      return undefined;
    }
    let index = getNextDotIndex(puzzleArray);
    if (index === -1) {
      return puzzleArray;
    }

    let row = Math.floor(index / 9);
    let col = index % 9;

    for (var i = 1; i <= 9; i++) {
      if (getNextDotIndex(puzzleArray) === -1) {
        return puzzleArray;
      }
      if (this.checkOne(puzzleArray.join(""), row, col, i)) {
        puzzleArray[index] = i.toString();
        this.executeSolve(puzzleArray, x++);
      }
    }
    let nextIndex = getNextDotIndex(puzzleArray);
    if (nextIndex !== -1) {
      puzzleArray[index] = ".";
    }
    return puzzleArray;
  }

  checkOne(puzzleString, row, col, val) {
    if (
      this.checkRowPlacement(puzzleString, row, col, val) &&
      this.checkColPlacement(puzzleString, row, col, val) &&
      this.checkRegionPlacement(puzzleString, row, col, val)
    ) {
      return true;
    }
    return false;
  }
}


module.exports = SudokuSolver;

const getNextDotIndex = (puzzleArray) => {
  for (var i = 0; i < puzzleArray.length; i++) {
    if (puzzleArray[i] === ".") {
      return i;
    }
  }
  return -1;
};