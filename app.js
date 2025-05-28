import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Almacenamiento temporal de posts
const posts = [];

// Ruta principal: mostrar posts
app.get('/', (req, res) => {
  res.render('index', { posts });
});

// Formulario para nuevo post
app.get('/new', (req, res) => {
  res.render('new');
});

// Procesar nuevo post
app.post('/new', (req, res) => {
  const { title, content } = req.body;
  if (title && content) {
    posts.unshift({ title, content, date: new Date() });
  }
  res.redirect('/');
});

// Vista de post individual
app.get('/post/:id', (req, res) => {
  const post = posts[req.params.id];
  if (!post) return res.redirect('/');
  res.render('post', { post, id: req.params.id });
});

// Formulario para editar post
app.get('/post/:id/edit', (req, res) => {
  const post = posts[req.params.id];
  if (!post) return res.redirect('/');
  res.render('edit', { post, id: req.params.id });
});

// Procesar edición de post
app.post('/post/:id/edit', (req, res) => {
  const { title, content } = req.body;
  const post = posts[req.params.id];
  if (post && title && content) {
    post.title = title;
    post.content = content;
  }
  res.redirect(`/post/${req.params.id}`);
});

// Eliminar post
app.post('/post/:id/delete', (req, res) => {
  const id = parseInt(req.params.id);
  if (!isNaN(id) && posts[id]) {
    posts.splice(id, 1);
  }
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
