const User = require('./user')
const Article = require('./article')
const Tag = require('./tag')
const Media = require('./media')
const ArticleTag = require('./articleTag')
const ArticleMedia = require('./articleMedia')
const ArticleLike = require('./articleLike')
const ArticleCollect = require('./articleCollect')
const UserFollow = require('./userFollow')
const Message = require('./message')

module.exports = {
    User,
    UserFollow,
    Article, Tag, Media, Message,
    ArticleTag,
    ArticleMedia,
    ArticleLike,
    ArticleCollect,
}