const express = require("express");
const app = express();
const morgan = require("morgan");
const postBank = require("./postBank");

app.use(morgan("dev"));

app.use((req, res, next) => {
  console.log("middleware func");
  next();
});

app.get("/", (req, res, next) => {
  // next()

  const posts = postBank.list();

  const html = `<DOCTYPE html>
  <html>
  <head>
  <title>Wizard News</title>
  <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
  <div class="news-list">
  <header><img src="/logo.png"/>Wizard News</header>
  ${posts
    .map(
      (post) => `
      <div class='news-item'>
      <a href="/posts/${post.id}">${post.title}</a>
      <p>
      <span class="news-position">${post.id}. ▲</span>${post.title}
      <small>(by ${post.name})</small>
      </p>
      <small class="news-info">
      ${post.upvotes} upvotes | ${post.date}
      </small>
      </div>`
    )
    .join("")}
      </div>
      </body>
      </html>`;

  res.send(html);
});

app.get("/posts/:id", (req, res, next) => {
  const id = req.params.id;
  const post = postBank.find(id);
  if (!post.id) {
    // If the post wasn't found, set the HTTP status to 404 and send Not Found HTML
    res.status(404);
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Wizard News</title>
          <link rel="stylesheet" href="/style.css" />
        </head>
        <body>
          <header><img src="/logo.png"/>Wizard News</header>
          <div class="not-found">
            <p>Accio Page! 🧙‍♀️ ... Page Not Found</p>
            <img src="/dumbledore-404.gif" />
          </div>
        </body>
        </html>`;
    res.send(html);
  } else {
    console.log(post);

    const html = `<DOCTYPE html>
      <html>
      <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
      <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      <div class='news-item'>
      <h3>${post.title} <small>(by ${post.name})</small></h3> 
      <p>${post.content}</p>
      <p>${post.date}</p>
      </div>
      </div>
      </body>
      </html>`;

    res.send(html);
  }
});

app.get("/users/:name", (req, res) => {
  console.log(req.params.name);
});

app.use(express.static(`public`));

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
