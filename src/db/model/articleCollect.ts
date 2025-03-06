import { Model, DataTypes } from "sequelize"
import sequelize from "../seq"
import ArticleModel from "./article"
import User from "./user"

class ArticleCollectModel extends Model {
    public id!: number
    public articleId!: number
    public userId!: number
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ArticleCollectModel.init({
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
    modelName: 'article_collect',
    timestamps: true
})

// 文章和 ArticleCollect 之间的一对多关系
ArticleModel.hasMany(ArticleCollectModel, { foreignKey: 'articleId', as: 'collects' })
ArticleCollectModel.belongsTo(ArticleModel, { foreignKey: 'articleId' })

// 用户和 ArticleCollect 之间的一对多关系
User.hasMany(ArticleCollectModel, { foreignKey: 'userId', as: 'collects' })
ArticleCollectModel.belongsTo(User, { foreignKey: 'userId' })

export default ArticleCollectModel