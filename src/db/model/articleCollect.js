const { sequelize } = require('../seq')
const Article = require('./article')
const User = require('./user')

const ArticleCollect = sequelize.define('article_collect', {}, { timestamps: true })

// 关联一对一关系
// ArticleCollect.hasOne(Article, { foreignKey: 'articleId' })
// Article.belongsTo(ArticleCollect)
// ArticleCollect.hasOne(User, { foreignKey: 'userId' })
// User.belongsTo(ArticleCollect)
Article.hasOne(ArticleCollect, { foreignKey: 'articleId' })
ArticleCollect.belongsTo(Article)

User.hasOne(ArticleCollect, { foreignKey: 'userId' })
ArticleCollect.belongsTo(User)

module.exports = ArticleCollect