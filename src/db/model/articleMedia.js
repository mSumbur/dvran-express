const { sequelize } = require('../seq')
const Article = require('./article')
const Media = require('./media')

const ArticleMedia = sequelize.define('article_media', {}, { timestamps: true })

// 关联多对多关系
Article.belongsToMany(Media, { through: ArticleMedia })
Media.belongsToMany(Article, { through: ArticleMedia })

module.exports = ArticleMedia