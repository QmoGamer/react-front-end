import express from 'express'
import serialize from 'serialize-javascript'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { createMemoryHistory, match, RouterContext } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { configureStore } from './src/store'
import routes from './src/routes'

const app = express()
app.use('/public', express.static(__dirname + '/public'))

/* api endpoints */

import npmPackages from './src/api/routes/npmPackages'
app.use('/api/npmPackages', npmPackages)

import npmPackage from './src/api/routes/npmPackage'
app.use('/api/npmPackage', npmPackage)

import home from './src/api/routes/home'
app.use('/api/home', home)

import member from './src/api/routes/member'
app.use('/api/member', member)

import article from './src/api/routes/article'
app.use('/api/article', article)

import theme from './src/api/routes/theme'
app.use('/api/theme', theme)

import news from './src/api/routes/news'
app.use('/api/news', news)

import backend from './src/api/routes/backend'
app.use('/api/backend', backend)

//====================

const HTML = ({ content, store }) => (
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <meta charset="utf-8" />
      <link rel="icon" href="/public/img/favicon.ico" />

      <link rel='stylesheet' type='text/css' href='/public/style.css' />
      <link rel="stylesheet" type="text/css" href="/public/qmo.css" />
      <link rel="stylesheet" type="text/css" href="/public/font-awesome/css/font-awesome.min.css" />
      <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
      <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />

      <link href="/public/bower_components/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="/public/bower_components/metisMenu/dist/metisMenu.min.css" rel="stylesheet" />
      <link href="/public/dist/css/sb-admin-2.css" rel="stylesheet" />
      <link href="/public/bower_components/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
      <link rel="stylesheet" type="text/css" href="/public/animate.css" />
    </head>
    <body>
      <div id='mount' dangerouslySetInnerHTML={{ __html: content }}/>
      <script dangerouslySetInnerHTML={{ __html: `window.__initialState__=${serialize(store.getState())};` }}/>
      <script src='/public/vendor.js' />
      <script src='/public/bundle.js' />

      <script src="/public/bower_components/jquery/dist/jquery.min.js" />
      <script src="/public/bower_components/bootstrap/dist/js/bootstrap.min.js" />
      <script src="/public/bower_components/metisMenu/dist/metisMenu.min.js" />
      <script src="/public/dist/js/sb-admin-2.js" />
      <script src="//cdn.tinymce.com/4/tinymce.min.js"></script>
    </body>
  </html>
)


app.use(function (req, res) {

  const memoryHistory = createMemoryHistory(req.path)
  let store = configureStore(memoryHistory )
  const history = syncHistoryWithStore(memoryHistory, store)

  /* react router match history */
  match({ history, routes , location: req.url }, (error, redirectLocation, renderProps) => {

    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {

      /* call static fetchData on the container component */
      fetchData().then( ()=> {
        store = configureStore(memoryHistory, store.getState() )
        const content = renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps}/>
          </Provider>
        )
        res.send('<!doctype html>\n' + renderToString(<HTML content={content} store={store}/>))
      }).catch(function (error) {
        /* do something with error */
        console.log(error.stack);
      });

      /* fetch data promise */
      function fetchData () {
        let { query, params } = renderProps;
        return new Promise(function(resolve, reject) {
          let comp = renderProps.components[renderProps.components.length - 1].WrappedComponent;
          let url = req.protocol + '://' + req.get('host')
          resolve(comp.fetchData({ params, store, url }));
        });
      }

    }
  })

})


app.listen(3000, 'localhost', function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('listening on http://127.0.0.1:3000')
})
