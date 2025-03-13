import { Model, DataTypes } from "sequelize"
import sequelize from "../seq"
import ArticleModel from "./article"
import User from "./user"

class ArticleLikeModel extends Model {
    public id!: number
    public articleId!: number
    public userId!: number
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ArticleLikeModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    articleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ArticleModel,
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
    modelName: 'article_like',
    timestamps: true
})

// 文章和点赞记录之间的一对多关系
ArticleModel.hasMany(ArticleLikeModel, { foreignKey: 'articleId', as: 'likes', onDelete: 'RESTRICT' })
ArticleLikeModel.belongsTo(ArticleModel, { foreignKey: 'articleId', onDelete: 'RESTRICT' })

// 用户和点赞记录之间的一对多关系
User.hasMany(ArticleLikeModel, { foreignKey: 'userId', as: 'likes', onDelete: 'RESTRICT' })
ArticleLikeModel.belongsTo(User, { foreignKey: 'userId', onDelete: 'RESTRICT' })

export default ArticleLikeModel