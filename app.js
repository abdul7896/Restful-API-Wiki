const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("article", articleSchema);

app.route("/articles").get().post().delete();



app.get("/articles", function(req, res) {
    Article.find(function(err, foundArticles) {
        if (!err) {
            res.send(foundArticles)
        } else {
            res.send(err)
        }
    })
})


app.post("/articles", function(req, res) {

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err) {
        if (!err) {
            res.send("Succesfully Added new article")
        } else {
            res.send(err)
        }
    });

});


app.delete("/articles", function(req, res) {
    Article.deleteMany(function(err) {
        if (!err) {
            res.send("Succesfully deleted all articles")
        } else {
            res.send(err)
        }
    })
})

app.get("/articles/:article", function(req, res) {
    Article.findOne({
        title: req.params.article
    }, function(err, foundArticles) {
        if (!err) {
            if (foundArticles) {
                res.send(foundArticles)
            } else {
                res.send("Article doesnot exist")
            }
        } else {
            res.send(err)
        }
    })
})

app.put("/articles/:article", function(req, res) {
    Article.update({
        title: req.params.article
    }, {
        title: req.body.title,
        content: req.body.content
    }, {
        overwrite: true
    }, function(err) {
        if (!err) {
            res.send("Updated Succesfully")
        }
    })
})

app.patch("/articles/:article", function(req, res) {
    Article.update({
        title: req.params.article
    }, {
        $set: req.body
    }, function(err) {
        if (!err) {
            res.send("Succesfully Updated Specific Fields")
        } else {
            res.send(err)
        }
    })
})





app.delete("/articles/:article", function(req, res) {
    Article.deleteOne({
        title: req.params.article
    }, function(err, foundArticles) {
        if (!err) {
            if (foundArticles) {
                res.send("Succesfully deleted requested article")
            } else {
                res.send("Article doesnot exist")
            }
        } else {
            res.send(err)
        }
    })
})



app.listen(3000, function() {
    console.log("Server started on port 3000");
});
