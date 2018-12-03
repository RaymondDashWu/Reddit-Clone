var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../app");
var should = chai.should();
chai.use(chaiHttp);

var agent = chai.request.agent(server);

var User = require("../models/user");

describe("User", function () {
    // TESTS WILL GO HERE.
    it("should be able to login as this is a test account", done => {
        agent.post("/login", {
            email: "tester",
            password: "tester"
        }).end(function (err, res) {
            res.status.should.be.equal(200);
            done();
        });
    });
    it("should not be able to login if they have not registered", done => {
        agent.post("/login", {
            email: "wrong@wrong.com",
            password: "nope"
        }).end(function (err, res) {
            res.status.should.be.equal(401);
            done();
        });
    });
    // signup
    it("should be able to signup", done => {
        User.findOneAndRemove({
            username: "testone"
        }, function () {
            agent
                .post("/sign-up")
                .send({
                    username: "testone",
                    password: "password"
                })
                .end(function (err, res) {
                    console.log(res.body);
                    res.should.have.status(200);
                    res.should.have.cookie("nToken");
                    done();
                });
        });
    });
    // login
    it("should be able to login", done => {
        agent
            .post("/login")
            .send({
                email: "username",
                password: "password"
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.have.cookie("nToken");
                done();
            });
    });
    // logout
    it("should be able to logout", done => {
        agent.get("/logout").end(function (err, res) {
            res.should.have.status(200);
            res.should.not.have.cookie("nToken");
            done();
        });
    });
});