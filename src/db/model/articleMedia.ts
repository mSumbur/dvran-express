import sequelize from "../seq"
import Article from "./article"
import Media from "./media"

const ArticleMedia = sequelize.define(
    'article_images',
    {},
    { timestamps: true }
)

Article.belongsToMany(Media, { through: ArticleMedia, as: 'images', onDelete: 'CASCADE' })
Media.belongsToMany(Article, { through: ArticleMedia, onDelete: 'CASCADE' })

export default ArticleMedia