import sequelize from "../seq"
import Article from "./article"
import User from "./user"
// const Article = require('./article')
// const User = require('./user')

const ArticleLike = sequelize.define('article_like', {}, { timestamps: true })

// 关联一对一关系
// ArticleLike.hasOne(Article, { foreignKey: 'articleId' })
// Article.belongsTo(ArticleLike)
Article.hasOne(ArticleLike, { foreignKey: 'articleId' })
ArticleLike.belongsTo(Article)

// ArticleLike.hasOne(User, { foreignKey: 'userId' })
// User.belongsTo(ArticleLike)
User.hasOne(ArticleLike, { foreignKey: 'userId' })
ArticleLike.belongsTo(User)

export default ArticleLike

// module.exports = ArticleLike