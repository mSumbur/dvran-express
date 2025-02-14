import sequelize from "../seq"
import Article from "./article"
import Media from "./media"

const ArticleMedia = sequelize.define('article_media', {}, { timestamps: true })

// 关联多对多关系
Article.belongsToMany(Media, { through: ArticleMedia, onDelete: 'CASCADE' })
Media.belongsToMany(Article, { through: ArticleMedia, onDelete: 'CASCADE' })

export default ArticleMedia