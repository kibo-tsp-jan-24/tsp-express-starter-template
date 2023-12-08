const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express')
const jwt = require('jsonwebtoken')
var session = require('express-session');
const { PrismaClient } = require('@prisma/client')

const path = require('path');
const prisma = new PrismaClient()
const app = express()

// config
const SECRET_KEY = 'asddf3234sdfaw34r4lkasdf' // NOTE: This should be a secret in production
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: SECRET_KEY
}));

// Session-persisted message middleware

app.use(function(req, res, next) {
  const err = req.session.error;
  const msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<div class="alert alert-warning" role="alert">' + err + '</div>';
  if (msg) res.locals.message = '<div class="alert alert-success" role="alert">' + msg + '</div>';
  next();
});

// Helper functions

async function authenticate(email, password) {
  const user = await prisma.user.findUnique({
    where: { email: email }
  });
  if (!user || user.password !== password) {
    return null
  }
  return user
}

const authorize = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const data = jwt.verify(token, SECRET_KEY);
    if (req.params.id != data.user.id) {
      return res.sendStatus(403);
    }
    return next();
  } catch {
    return res.sendStatus(403);
  }
};


// Routes

app.get('/', async (req, res) => {
  res.redirect('/login');
});

app.get('/login', async function(req, res){
  res.render('login');
});

app.post('/login', async (req, res) => {
  const user = await authenticate(req.body.email, req.body.password)
  if (user) {
    req.session.regenerate(function() {
      req.session.success = 'Authenticated as ' + user.name
        + ' click to <a href="/logout">logout</a>. ';
      const token = jwt.sign({ user: { id : user.id } }, SECRET_KEY, { expiresIn: '1h' });
      res
        .cookie("access_token", token, { httpOnly: true, maxAge: 60*60*1000 })
        .redirect('/user/' + user.id + '/posts');
    });
  } else {
    req.session.error = 'Authentication failed, please check your email and password.';
    res.redirect('/login');
  }
});

app.get('/logout', function(req, res){
  req.session.destroy(function() {
    res.clearCookie("access_token")
    .redirect('/');
  });
});

app.get('/register', async (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  const existingUser = await prisma.user.findUnique({
    where: { email: email }
  });

  if (existingUser) {
    req.session.error = 'Registration failed, email already exists.';
    res.redirect('/register');
  }
  else {
    const result = await prisma.user.create({
      data: {
        name,
        email,
        password // NOTE: this should be hashed in production
      },
    })
    req.session.error = 'Registration Successful, please login.';
    res.redirect('/login');
  }
})

app.get('/user/:id/posts', authorize, async (req, res) => {
  const author = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
  })
  delete author.password
  const posts = await prisma.post.findMany({
    where: {
      authorId: Number(req.params.id),
    },
  })

  res.render('posts', { author, posts })
})

app.post('/post', async (req, res) => {
  const { title, content, authorEmail } = req.body
  const result = await prisma.post.create({
    data: {
      title,
      content,
      author: { connect: { email: authorEmail } },
    },
  })
  res.redirect('/user/' + result.authorId + '/posts');
})

app.delete('/post/:id', async (req, res) => {
  const { id } = req.params
  const post = await prisma.post.delete({
    where: {
      id: Number(id),
    },
  })
  res.json(post)
})

const server = app.listen(3000, () =>
  console.log(`🚀 Server ready at: http://localhost:3000`)
)
