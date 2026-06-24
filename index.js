const express = require('express');

const path = require('path');

const moment = require('moment');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const http = require('http');
const { Server } = require('socket.io');

require('dotenv').config();

const methodOverride = require('method-override');

// thư viện để hiển thị thông báo
const flash = require('connect-flash');

const database = require('./configs/database');

const systemConfig = require('./configs/system');

const routeAdmin = require('./routes/admin/index.route');
const route = require('./routes/client/index.route');


const app = express();
const port = process.env.PORT;

// Socket.io
const server = http.createServer(app);
const io = new Server(server);
global._io = io;
// End Socket.io


async function startServer() {
  await database.connect();


  app.use(methodOverride('_method'));

  app.use(bodyParser.urlencoded({ extended: false }));

  // TinyMCE
  app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
  // End TinyMCE


  app.set('views', `${__dirname}/views`);
  app.set('view engine', 'pug');

  // Flash 
  app.use(cookieParser("VANKHAI"));
  app.use(session({ cookie: { maxAge: 60000 } }));
  app.use(flash());

  app.use((req, res, next) => {
    res.locals.messages = req.flash(); // req.flash() trả về một object chứa các message
    next();
  });
  // End Flash

  // App locals variables : tạo ra 1 biến toàn cục để dụng được trong file .pug
  app.locals.prefixAdmin = systemConfig.prefixAdmin;

  app.locals.moment = moment;

  // sử dụng file tĩnh 
  app.use(express.static(`${__dirname}/public`));

  // Routes ( đăng ký các route vào server express )
  routeAdmin(app);
  route(app);
  // 404
  app.use((req, res) => {
    res.status(404).render('client/pages/errors/404', {
      pageTitle: '404 Not Found'
    });
  });

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer();