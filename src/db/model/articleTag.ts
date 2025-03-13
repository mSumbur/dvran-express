import sequelize from "../seq"
import ArticleModel from "./article"
import Tag from "./tag"

const ArticleTagModel = sequelize.define('article_tag', {}, { timestamps: true })

ArticleModel.belongsToMany(Tag, { through: ArticleTagModel, onDelete: 'RESTRICT' })
Tag.belongsToMany(ArticleModel, { through: ArticleTagModel, onDelete: 'RESTRICT' })

export default ArticleTagModel