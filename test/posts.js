const Post = require("../models/post");
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();

chai.use(chaiHttp);

describe("Posts", () => {
    before(done => {
        agent
            .post("/login")
            .send({
                username: "testone",
                password: "password"
            })
            .end(function (err, res) {
                done();
            });
    });

    // TOFIX: Everything below needs to be updated to new code. Does not work atm.
    it("should create with valid attributes at POST /posts", done => {
        // test code
        // Import your Post model
        Post.find(function (err, posts) {
            var postCount = posts.count;

            var post = {
                title: "post title",
                url: "https://www.google.com",
                summary: "post summary"
            };

            chai
                .request("localhost:3000")
                .post("/posts")
                .send(post)
                .then(res => {
                    Post.find(function (err, posts) {
                        postCount.should.be.equal(posts.length - 1);
                        res.should.have.status(200);
                        return done();
                    });
                })
                .catch(err => {
                    return done(err);
                });
        });
        var post = {
            title: "post title",
            url: "https://www.google.com",
            summary: "post summary"
        };

        Post.findOneAndRemove(post, function () {
            Post.find(function (err, posts) {
                var postCount = posts.count;
                chai
                    .request("localhost:3000")
                    .post("/posts")
                    .send(post)
                    .then(res => {
                        Post.find(function (err, posts) {
                            postCount.should.be.equal(posts.length + 1);
                            res.should.have.status(200);
                            return done();
                        });
                    })
                    .catch(err => {
                        return done(err);
                    });
            });
        });
    });
});


// describe("Posts", () => {
//     // Describe what you are testing
//     it("should create with valid attributes at POST /posts", done => {
//         // Describe what should happen
//         // In this case we test that the home page loads
//         Post.find(function (err, posts) {
//             var postCount = posts.count;

//             var post = {
//                 title: "post title",
//                 url: "https://www.google.com",
//                 summary: "post summary"
//             };

//             chai
//                 .request("localhost:3000")
//                 .post("/posts")
//                 .send(post)
//                 .then(res => {
//                     Post.find(function (err, posts) {
//                         postCount.should.be.equal(posts.length - 1);
//                         res.should.have.status(200);
//                         return done();
//                     });
//                 })
//                 .catch(err => {
//                     return done(err);
//                 });
//         });
//         var post = { title: "post title", url: "https://www.google.com", summary: "post summary" };

//         Post.findOneAndRemove(post, function () {
//             Post.find(function (err, posts) {
//                 var postCount = posts.count;
//                 chai
//                     .request("localhost:3000")
//                     .post("/posts")
//                     .send(post)
//                     .then(res => {
//                         Post.find(function (err, posts) {
//                             postCount.should.be.equal(posts.length + 1);
//                             res.should.have.status(200);
//                             return done();
//                         });
//                     })
//                     .catch(err => {
//                         return done(err);
//                     });
//             });
//         });
//     });
// });