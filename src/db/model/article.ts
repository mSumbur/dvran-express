import { DataTypes, Model } from "sequelize"
import sequelize from "../seq"
import User from "./user"
import Media from "./media"

class ArticleModel extends Model {
    public id!: number
    public title!: string           // 标题
    public text!: string            // 内容
    public openid?: string | null   //
    public userId!: number          //
    public isRecommend!: boolean    // 是否推荐
    public isApproved!: boolean     // 是否过审核
    public deletedAt?: Date | null  

    public readonly images?: Media[]
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
}

ArticleModel.init({
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

// 用户和文章关系
User.hasMany(ArticleModel)
ArticleModel.belongsTo(User)

// 文章和媒体关系
// ArticleModel.belongsToMany(Media, { through: 'article_media' })
// Media.belongsToMany(ArticleModel, { through: 'article_media' })

export default ArticleModel
