import path from 'path'
import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackConfig from './webpack.config.dev'

const app = express();

/* api endpoints */

const npmPackages = require('./src/api/routes/npmPackages')
app.use('/api/npmPackages', npmPackages)

const npmPackage = require('./src/api/routes/npmPackage')
app.use('/api/npmPackage', npmPackage)

const home = require('./src/api/routes/home')
app.use('/api/home', home)

const member = require('./src/api/routes/member')
app.use('/api/member', member)

const article = require('./src/api/routes/article')
app.use('/api/article', article)

const theme = require('./src/api/routes/theme')
app.use('/api/theme', theme)

const news = require('./src/api/routes/news')
app.use('/api/news', news)

const backend = require('./src/api/routes/backend')
app.use('/api/backend', backend)

//====================

app.use(webpackDevMiddleware(webpack(webpackConfig), {
  publicPath: webpackConfig.output.publicPath,
  stats: { colors: true }
}));

app.use('/public', express.static(__dirname + '/public'))


app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.listen(3000, 'localhost', function (err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('listening on http://127.0.0.1:3000')
})
