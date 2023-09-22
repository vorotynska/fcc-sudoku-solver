const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const puzzles = require("../controllers/puzzle-strings.js").puzzlesAndSolutions;
let solver = new Solver()

suite('Unit Tests', () => {
    const validString =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const invalidStringLen = ".";
    const invalidStringChar =
        "?.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const conflictingString =
        "125..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const noSolutionString =
        ".....5.8....6.1.43..........1.5........1.6...3.......553.....61........4.........";
    test("Test valid puzzle string of 81 characters", () => {
        for (var i = 0; i < puzzles.length; i++) {
            assert.equal(
                solver.validate(puzzles[i][0]),
                undefined,
                "Solver should correctly pass a valid 81 character string"
            );
        }
    });
    test("Test puzzle string with invalid characters", () => {
        assert.equal(
            solver.validate(invalidStringChar),
            "a",
            "Solver should handle puzzle string with invalid characters"
        );
    });
    test("Test invalid puzzle string that is not 81 characters long", () => {
        assert.equal(
            solver.validate(invalidStringLen),
            "b",
            "Solver should handle puzzle that is not 81 characters long"
        );
    });
    test("Test a valid row placement", () => {
        assert.equal(
            solver.checkRowPlacement(validString, 0, 1, 3),
            true,
            "Solver should return true on valid row placement"
        );
    });
    test("Test an invalid row placement", () => {
        assert.equal(
            solver.checkRowPlacement(validString, 0, 1, 2),
            false,
            "Solver should return false on invalid row placement"
        );
    });
    test("Test a valid column placement", () => {
        assert.equal(
            solver.checkColPlacement(validString, 0, 1, 3),
            true,
            "Solver should return true on valid column placement"
        );
    });
    test("Test an invalid column placement", () => {
        assert.equal(
            solver.checkColPlacement(validString, 0, 1, 2),
            false,
            "Solver should return false on invalid column placement"
        );
    });
    test("Test a valid region placement", () => {
        assert.equal(
            solver.checkRegionPlacement(validString, 0, 1, 3),
            true,
            "Solver should return true on valid region placement"
        );
    });
    test("Test an invalid region placement", () => {
        assert.equal(
            solver.checkRegionPlacement(validString, 0, 1, 2),
            false,
            "Solver should return false on invalid region placement"
        );
    });
    test("Test that valid puzzles pass the solver", () => {
        for (let i = 0; i < puzzles.length; i++) {
            let sol = solver.solve(puzzles[i][0]);
            assert.equal(
                sol,
                puzzles[i][1],
                "Solver should return the solution of valid puzzles"
            );
        }
    });
    test("Test that invalid puzzles do not pass the solver", () => {
        assert.equal(
            solver.solve(invalidStringChar),
            "a",
            "Solver should not pass an invalid puzzle string (invalid char)."
        );
        assert.equal(
            solver.solve(invalidStringLen),
            "b",
            "Solver should not pass an invalid puzzle string (invalid length)."
        );
        assert.equal(solver.solve(), "g", "Solver should not pass an empty string");
        assert.equal(
            solver.solve(conflictingString),
            "f",
            "Solver should not pass a conflicting string"
        );
        assert.equal(
            solver.solve(noSolutionString, 4),
            "f",
            "Solver should not pass a string that might take too long to solve"
        );
    });
    test("Test that valid puzzles in solve returns a solution", () => {
        for (let i = 0; i < puzzles.length; i++) {
            var sol = solver.solve(puzzles[i][0]);
            assert.equal(
                sol,
                puzzles[i][1],
                "Solver should return the solution of valid puzzles"
            );
        }
    });
});