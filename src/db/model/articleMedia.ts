import sequelize from "../seq";
import ArticleModel from "./article";
import Media from "./media";

const ArticleMediaModel = sequelize.define('article_media', {}, { timestamps: true })

ArticleModel.belongsToMany(Media, {
    through: ArticleMediaModel
})
Media.belongsToMany(ArticleModel, {
    through: ArticleMediaModel
})

export default ArticleMediaModel