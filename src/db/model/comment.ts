import { DataTypes, Model, Optional } from "sequelize"
import sequelize from "../seq"
import User from "./user"
import Article from "./article"

// 定义 Comment 属性类型
// interface CommentAttributes {
//     id: number
//     articleId: number
//     userId: number
//     content: string
//     parentId?: number | null
//     deletedAt?: Date | null
// }

// 创建时
// export interface CommentCreationAttributes extends Optional<CommentAttributes, 'id' | 'parentId' | 'deletedAt'> {}

// 定义 Comment 模型
class CommentModel extends Model {
    public id!: number
    public articleId!: number
    public userId!: number
    public content!: string
    public parentId!: number | null
    public deletedAt!: Date | null

    public readonly createdAt!: Date
    public readonly updatedAt!: Date
}

// 初始化模型
CommentModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        articleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Article, // 关联文章表
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User, // 关联用户表
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: CommentModel, // 自引用，指向 Comment 自身
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
    },
    {
        sequelize,
        tableName: 'comments',
        timestamps: true,
        paranoid: true,  // 启用软删除
    }
)

// 定义模型关联关系
Article.hasMany(CommentModel, { foreignKey: 'articleId', as: 'comments' })
CommentModel.belongsTo(Article, { foreignKey: 'articleId', as: 'article' })

User.hasMany(CommentModel, { foreignKey: 'userId', as: 'comments' })
CommentModel.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// 关键：建立自引用关系
CommentModel.hasMany(CommentModel, { foreignKey: 'parentId', as: 'replies' })
CommentModel.belongsTo(CommentModel, { foreignKey: 'parentId', as: 'parentComment' })

export default CommentModel