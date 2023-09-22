const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const puzzles = require("../controllers/puzzle-strings.js").puzzlesAndSolutions;
chai.use(chaiHttp);

suite('Functional Tests', () => {
    const invalidStringChar =
        "?.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const invalidStringLen = ".";
    const conflictingString =
        "125..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    test("Test /api/solve POST with valid puzzle string", (done) => {
        chai
            .request(server)
            .post("/api/solve")
            .set("content-type", "application/json")
            .send({
                puzzle: puzzles[1][0]
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    assert.equal(res.status, 200);
                    assert.property(
                        res.body,
                        "solution",
                        "Return value must contain property solution"
                    );
                    assert.equal(res.body.solution, puzzles[1][1]);
                    done();
                }
            });
    });
    test("Test /api/solve POST with a missing puzzle string", (done) => {
        chai
            .request(server)
            .post("/api/solve")
            .set("content-type", "application/json")
            .send({})
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    assert.equal(res.status, 200);
                    assert.property(
                        res.body,
                        "error",
                        "Return value must contain property error"
                    );
                    assert.equal(res.body.error, "Required field missing");
                    done();
                }
            });
    });
    test("Test /api/solve POST with an invalid character in the puzzle string", (done) => {
        chai
            .request(server)
            .post("/api/solve")
            .set("content-type", "application/json")
            .send({
                puzzle: invalidStringChar
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    assert.equal(res.status, 200);
                    assert.property(
                        res.body,
                        "error",
                        "Return value must contain property error"
                    );
                    assert.equal(res.body.error, "Invalid characters in puzzle");
                    done();
                }
            });
    });
    test("Test /api/solve POST with an invalid length puzzle string", (done) => {
        chai
            .request(server)
            .post("/api/solve")
            .set("content-type", "application/json")
            .send({
                puzzle: invalidStringLen
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    assert.equal(res.status, 200);
                    assert.property(
                        res.body,
                        "error",
                        "Return value must contain property error"
                    );
                    assert.equal(
                        res.body.error,
                        "Expected puzzle to be 81 characters long"
                    );
                    done();
                }
            });
    });
    test("Test /api/solve POST with an unsolvable puzzle string", (done) => {
        chai
            .request(server)
            .post("/api/solve")
            .set("content-type", "application/json")
            .send({
                puzzle: conflictingString
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    assert.equal(res.status, 200);
                    assert.property(
                        res.body,
                        "error",
                        "Return value must contain property error"
                    );
                    assert.equal(res.body.error, "Puzzle cannot be solved");
                    done();
                }
            });
    });
    test("Test /api/check POST with all fields", (done) => {
        chai
            .request(server)
            .post("/api/check")
            .set("content-type", "application/json")
            .send({
                puzzle: puzzles[0][0],
                coordinate: "A2",
                value: 3
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    assert.equal(res.status, 200);
                    assert.property(
                        res.body,
                        "valid",
                        "Return value must contain property valid"
                    );
                    assert.equal(res.body.valid, true);
                    done();
                }
            });
    });
    test("Test /api/check POST with a single placement conflict", (done) => {
        chai
            .request(server)
            .post("/api/check")
            .set("content-type", "application/json")
            .send({
                puzzle: puzzles[0][0],
                coordinate: "A2",
                value: 4
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    assert.equal(res.status, 200);
                    assert.property(
                        res.body,
                        "valid",
                        "Return value must contain property valid"
                    );
                    assert.property(
                        res.body,
                        "conflict",
                        "Return value must contain property conflict"
                    );
                    assert.equal(res.body.valid, false);
                    assert.equal(res.body.conflict.length, 1);
                    done();
                }
            });
    });
    test("Test /api/check POST with multiple placement conflicts", (done) => {
        chai
            .request(server)
            .post("/api/check")
            .set("content-type", "application/json")
            .send({
                puzzle: puzzles[0][0],
                coordinate: "B2",
                value: 7
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    assert.equal(res.status, 200);
                    assert.property(
                        res.body,
                        "valid",
                        "Return value must contain property valid"
                    );
                    assert.property(
                        res.body,
                        "conflict",
                        "Return value must contain property conflict"
                    );
                    assert.equal(res.body.valid, false);
                    assert.equal(res.body.conflict.length, 2);
                    done();
                }
            });
    });
    test("Test /api/check POST with all placement conflicts", (done) => {
        chai
            .request(server)
            .post("/api/check")
            .set("content-type", "application/json")
            .send({
                puzzle: puzzles[0][0],
                coordinate: "B1",
                value: 2
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    assert.equal(res.status, 200);
                    assert.property(
                        res.body,
                        "valid",
                        "Return value must contain property valid"
                    );
                    assert.property(
                        res.body,
                        "conflict",
                        "Return value must contain property conflict"
                    );
                    assert.equal(res.body.valid, false);
                    assert.equal(res.body.conflict.length, 3);
                    done();
                }
            });
    });
    test("Test /api/check POST with missing required fields", (done) => {
        chai
            .request(server)
            .post("/api/check")
            .set("content-type", "application/json")
            .send({})
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    assert.equal(res.status, 200);
                    assert.property(
                        res.body,
                        "error",
                        "Return value must contain property error"
                    );
                    assert.equal(res.body.error, "Required field(s) missing");
                    done();
                }
            });
    });
    test("Test /api/check POST with invalid characters", (done) => {
        chai
            .request(server)
            .post("/api/check")
            .set("content-type", "application/json")
            .send({
                puzzle: invalidStringChar,
                coordinate: "A2",
                value: 3
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    assert.equal(res.status, 200);
                    assert.property(
                        res.body,
                        "error",
                        "Return value must contain property error"
                    );
                    assert.equal(res.body.error, "Invalid characters in puzzle");
                    done();
                }
            });
    });
    test("Test /api/check POST with invalid puzzle length", (done) => {
        chai
            .request(server)
            .post("/api/check")
            .set("content-type", "application/json")
            .send({
                puzzle: invalidStringLen,
                coordinate: "A2",
                value: 3
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    assert.equal(res.status, 200);
                    assert.property(
                        res.body,
                        "error",
                        "Return value must contain property error"
                    );
                    assert.equal(
                        res.body.error,
                        "Expected puzzle to be 81 characters long"
                    );
                    done();
                }
            });
    });
    test("Test /api/check POST with invalid placement coordinate", (done) => {
        chai
            .request(server)
            .post("/api/check")
            .set("content-type", "application/json")
            .send({
                puzzle: puzzles[0][0],
                coordinate: "K2",
                value: 3
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    assert.equal(res.status, 200);
                    assert.property(
                        res.body,
                        "error",
                        "Return value must contain property error"
                    );
                    assert.equal(res.body.error, "Invalid coordinate");
                    done();
                }
            });
    });
    test("Test /api/check POST with invalid placement value", (done) => {
        chai
            .request(server)
            .post("/api/check")
            .set("content-type", "application/json")
            .send({
                puzzle: puzzles[0][0],
                coordinate: "A2",
                value: 10
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    assert.equal(res.status, 200);
                    assert.property(
                        res.body,
                        "error",
                        "Return value must contain property error"
                    );
                    assert.equal(res.body.error, "Invalid value");
                    done();
                }
            });
    });
});