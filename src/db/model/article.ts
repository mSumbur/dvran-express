// const { DataTypes } = require('sequelize')
// const { sequelize } = require('../seq')
import { DataTypes } from "sequelize"
import sequelize from "../seq"
import User from "./user"

const Article = sequelize.define('article', {
    title: {
        type: DataTypes.TEXT
    },    
    text: {
        type: DataTypes.TEXT
    },
    delta: DataTypes.JSON,
    openid: DataTypes.STRING,
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false        
    },
    status: {
        type: DataTypes.ENUM('normal', 'recommend'), // 0正常 1推荐 2待定
        defaultValue: 'normal'
    },    
    isAudit: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    // isDeleted: {
    //     type: DataTypes.BOOLEAN,
    //     defaultValue: false
    // }
}, {
    timestamps: true,
    paranoid: true
})

User.hasMany(Article)
Article.belongsTo(User)

export default Article

// module.exports = Article