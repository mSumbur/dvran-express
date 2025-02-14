import sequelize from "../seq"
import Article from "./article"
import Tag from "./tag"

const ArticleTag = sequelize.define('article_tag', {}, { timestamps: true })

// 关联多对多关系
Article.belongsToMany(Tag, { through: ArticleTag })
Tag.belongsToMany(Article, { through: ArticleTag })

export default ArticleTag