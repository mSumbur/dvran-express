const { sequelize } = require('../seq')
const Article = require('./article')
const Tag = require('./tag')

const ArticleTag = sequelize.define('article_tag', {}, { timestamps: true })

// 关联多对多关系
Article.belongsToMany(Tag, { through: ArticleTag })
Tag.belongsToMany(Article, { through: ArticleTag })

module.exports = ArticleTag