import { Model, DataTypes } from "sequelize"
import sequelize from "../seq"
import Article from "./article"
import User from "./user"

class ArticleLike extends Model {
    public id!: number
    public articleId!: number
    public userId!: number
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ArticleLike.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    articleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Article,
            key: 'id',
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
}, {
    sequelize,
    modelName: 'article_likes',
    timestamps: true
})

// 文章和 ArticleCollect 之间的一对多关系
Article.hasMany(ArticleLike, { foreignKey: 'articleId', as: 'likes' })
ArticleLike.belongsTo(Article, { foreignKey: 'articleId' })

// 用户和 ArticleCollect 之间的一对多关系
User.hasMany(ArticleLike, { foreignKey: 'userId', as: 'likes' })
ArticleLike.belongsTo(User, { foreignKey: 'userId' })

export default ArticleLike