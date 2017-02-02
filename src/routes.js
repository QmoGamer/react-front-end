import React from 'react'
import { Router, Route, IndexRoute, Link } from 'react-router'

/* container components */
import App from './containers/App'
import Packages from './containers/Packages/Packages'
import Package from './containers/Package/Package'
import Home from './containers/Ver2/Home/Home'
import ArticleDetail from './containers/ArticleDetail/ArticleDetail'
import Theme from './containers/Ver2/ThemePanel/Theme'
import SubTheme from './containers/Ver2/ThemePanel/SubTheme'
import MemberLogIn from './containers/MemberLogIn/MemberLogIn'
import PostArticle from './containers/Ver2/PostArticle/PostArticle'
import ReplyArticle from './containers/Ver2/ReplyArticle/ReplyArticle'
import NewsList from './containers/NewsList/NewsList'
import MemberInfo from './containers/MemberInfo/MemberInfo'
import MyPostArticle from './containers/MyPostArticle/MyPostArticle'
import MyCollectArticle from './containers/MyCollectArticle/MyCollectArticle'
import MyFollowUser from './containers/Ver2/MyFollowUser/MyFollowUser'
import NewsDetail from './containers/NewsDetail/NewsDetail'
import Search from './containers/Search/Search'
import EditArticle from './containers/Ver2/EditArticle/EditArticle'
import ForgotPassword from './containers/ForgotPassword/ForgotPassword'
import ResetPassword from './containers/ForgotPassword/ResetPassword'
import Authenticate from './containers/Authenticate/Authenticate'
import EditMemberInfo from './containers/EditMemberInfo/EditMemberInfo'
// import Ver2_HomeList from ''
// import Ver2_ThemeList from ''
// import Ver2_SubThemeList from './containers/Ver2/SubTheme/SubTheme'

import NotFound from './containers/NotFound/NotFound'
import ServerError from './containers/NotFound/ServerError'
import Upload from './containers/Upload/Upload'

import Backend from './backend/Backend'
import BackendLogin from './backend/Login/Login'
import BackendIndex from './backend/Index/Index'
import BackendTheme from './backend/Theme/Theme'
import BackendNews from './backend/News/News'
import BackendNewsDetail from './backend/News/NewsDetail'
import BackendArticlesList from './backend/Articles/Articles'
import BackendArticleDetail from './backend/Articles/ArticleDetail'

const routes = (
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="/search/:keyword/:page" component={Search} />
      <Route path="/news_detail/:news_id" component={NewsDetail} type="news" />
      <Route path="/theme_detail/:article_id" component={ArticleDetail} type="theme" />
      <Route path="/theme/:theme_id" component={Theme} />
      <Route path="/theme/:theme_id/:sub_theme_id" component={SubTheme} />
      <Route path="/member_login" component={MemberLogIn} tab="sign_in" />
      <Route path="/member_register" component={MemberLogIn} tab="register" />
      <Route path="/post_article" component={PostArticle} />
      <Route path="/reply_article/:article_id" component={ReplyArticle} />
      <Route path="/news_list/:page" component={NewsList} />
      <Route path="/member_info/:user_id/:page" component={MemberInfo} />
      <Route path="/my/follow/:page" component={MyFollowUser} />
      <Route path="/my/collect/:page" component={MyCollectArticle} />
      <Route path="/my/post/:page" component={MyPostArticle} />
      <Route path="/article/edit/:article_content_id" component={EditArticle} />
      <Route path="/forgot_password" component={ForgotPassword} />
      <Route path="/reset_password/:token" component={ResetPassword} />
      <Route path="/authenticate/:email/:token" component={Authenticate} />
      <Route path="/my/edit/member_info" component={EditMemberInfo} />

      <Route path="/upload" component={Upload} />

      <Route path="/packages" component={Packages} />
      <Route path="/package/:id/:name" component={Package} />
    </Route>
    <Route path="/admin" component={Backend}>
      <IndexRoute component={BackendIndex} />
      <Route path="theme" component={BackendTheme} />
      <Route path="news" component={BackendNews} />
      <Route path="news/:type" component={BackendNewsDetail} /> { /* 新增 */ }
      <Route path="news/:type/:news_id" component={BackendNewsDetail} /> { /* 修改 */ }
      <Route path="articles" component={BackendArticlesList} />
      <Route path="article_detail/:article_id" component={BackendArticleDetail} />
    </Route>
    <Route path="/admin/login" component={BackendLogin} />
    <Route path="*" component={NotFound} />
    <Route path="/server_error" component={ServerError} />
  </Router>
)

export default routes
