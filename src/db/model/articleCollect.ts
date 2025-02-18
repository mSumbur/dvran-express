import { Model, DataTypes } from "sequelize"
import sequelize from "../seq"
import Article from "./article"
import User from "./user"

class ArticleCollect extends Model {
    public id!: number
    public articleId!: number
    public userId!: number
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ArticleCollect.init({
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
    modelName: 'article_collects',
    timestamps: true
})

// 文章和 ArticleCollect 之间的一对多关系
Article.hasMany(ArticleCollect, { foreignKey: 'articleId', as: 'collects' })
ArticleCollect.belongsTo(Article, { foreignKey: 'articleId' })

// 用户和 ArticleCollect 之间的一对多关系
User.hasMany(ArticleCollect, { foreignKey: 'userId', as: 'collects' })
ArticleCollect.belongsTo(User, { foreignKey: 'userId' })

export default ArticleCollect