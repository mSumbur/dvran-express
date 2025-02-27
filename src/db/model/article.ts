// const { DataTypes } = require('sequelize')
// const { sequelize } = require('../seq')
import { DataTypes, Model, Optional } from "sequelize"
import sequelize from "../seq"
import User from "./user"
import Media, { MediaAttributes } from "./media"

// interface ArticleAttributes {
//     id: number
//     title: string
//     text: string
//     // delta: JSON
//     openid?: string | null
//     userId: number
//     isRecommend: boolean
//     isApproved: boolean
//     deletedAt?: Date | null    
//     image
// }

// export interface ArticleCreationAttributes extends Optional<ArticleAttributes, 'id' | 'openid' | 'deletedAt'> {}

class Article extends Model {
    public id!: number
    public title!: string
    public text!: string
    // public delta!: JSON
    public openid?: string | null
    public userId!: number
    public isRecommend!: boolean
    public isApproved!: boolean
    public deletedAt?: Date | null

    public readonly images?: Media[]
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
}

Article.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    isRecommend: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
}, {
    sequelize,
    modelName: 'articles',
    timestamps: true,
    paranoid: true
})

User.hasMany(Article, { foreignKey: 'userId', as: 'articles' })
Article.belongsTo(User, { foreignKey: 'userId', as: 'user' })

export default Article
