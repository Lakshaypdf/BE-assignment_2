const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware to log request details
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

// Set up EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Parse incoming request bodies
app.use(express.urlencoded({ extended: true }));

// Helper function to read posts from the JSON file
const readPosts = () => {
  const data = fs.readFileSync(path.join(__dirname, "posts.json"));
  return JSON.parse(data);
};

// Helper function to write posts to the JSON file
const writePosts = (posts) => {
  fs.writeFileSync(path.join(__dirname, "posts.json"), JSON.stringify(posts, null, 2));
};

// Render the index page at the root URL
app.get("/", (req, res) => {
  const posts = readPosts();
  res.render("index", { posts });
});

// GET /posts → Display all blog posts
app.get("/posts", (req, res) => {
  const posts = readPosts();
  res.render("index", { posts });
});

// GET /post?id=1 → Display a single post by ID
app.get("/post", (req, res) => {
  const posts = readPosts();
  const postId = parseInt(req.query.id);
  const post = posts.find((p) => p.id === postId);
  if (post) {
    res.render("post", { post });
  } else {
    res.status(404).send("Post not found");
  }
});

// GET /add-post → Display the form to add a new post
app.get("/add-post", (req, res) => {
  res.render("add-post");
});

// POST /add-post → Add a new post
app.post("/add-post", (req, res) => {
  const posts = readPosts();
  const newPost = {
    id: posts.length + 1,
    title: req.body.title,
    content: req.body.content,
  };
  posts.push(newPost);
  writePosts(posts);
  res.redirect("/posts");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});