import sequelize from "../seq"
import Article from "./article"
import Tag from "./tag"

const ArticleTag = sequelize.define('article_tags', {}, { timestamps: true })

Article.belongsToMany(Tag, { through: ArticleTag })
Tag.belongsToMany(Article, { through: ArticleTag })

export default ArticleTag