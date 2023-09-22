'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const puzzle = req.body.puzzle;


      // Validate puzzle. Empty response indicates that no errors were found.
      const validation = solver.validate(puzzle);
      if (validation) {
        return res.json({
          error: errors[validation]
        });
      }

      // Get the coords and value to check
      const coords = req.body.coordinate;
      const val = req.body.value;
      if (!coords || !val) {
        return res.json({
          error: errors.c
        });
      }
      // Check if coords are of one letter (a-i) and one digit (1-9) and in that order. Return error if not.
      const regexCoords = /^[a-i][1-9]{1}$/i;
      const regexValue = /^[1-9]{1}$/;
      if (!regexCoords.test(coords)) {
        return res.json({
          error: errors.d
        });
      }
      if (!regexValue.test(val)) {
        return res.json({
          error: errors.e
        });
      }
      // Split coords into row and column and also get the value to check.
      const row = coords.split("")[0].toLowerCase().charCodeAt(0) - 97;
      const column = coords.split("")[1] - 1;

      // Run check row placement function from solver class.
      // Run check col placement function from solver class.
      const rowCheck = solver.checkRowPlacement(puzzle, row, column, val);
      const colCheck = solver.checkColPlacement(puzzle, row, column, val);
      const regionCheck = solver.checkRegionPlacement(puzzle, row, column, val);

      if (rowCheck && colCheck && regionCheck) {
        return res.json({
          valid: true
        });
      }
      var conflict = [];
      if (!rowCheck) {
        conflict.push("row");
      }
      if (!colCheck) {
        conflict.push("column");
      }
      if (!regionCheck) {
        conflict.push("region");
      }
      res.json({
        valid: false,
        conflict: conflict
      });
    });

  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;

      // Strings are immutable and makes the 'Solver' difficult to work with is using strings. Changing the solver.solve to use puzzleArray instead of puzzleString.
      //      console.time('Timing solver')
      const solution = solver.solve(puzzle);
      //      console.timeEnd('Timing solver');

      // Sudoku puzzles are always solvable, though some variations can take this backtracking brute force algorithm too long to solve. Recursion depth has therefore been limited in the solver (see solver).
      if (solution.length === 1) {
        // If the puzzle string doesn't pass the validation inside the solver, or if the puzzle if deemed unsolvable
        return res.json({
          error: errors[solution]
        });
      }
      return res.json({
        solution: solution
      });
    });
};

const errors = {
  a: "Invalid characters in puzzle",
  b: "Expected puzzle to be 81 characters long",
  c: "Required field(s) missing",
  d: "Invalid coordinate",
  e: "Invalid value",
  f: "Puzzle cannot be solved",
  g: "Required field missing"
};