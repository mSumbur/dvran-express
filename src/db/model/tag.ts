import { DataTypes } from "sequelize"
import sequelize from "../seq"

const Tag = sequelize.define('tag', {    
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    openid: DataTypes.STRING,
    status: {
        type: DataTypes.ENUM('normal', 'recommend'), // 0正常 1推荐 2待定
        defaultValue: 'normal'
    },
    isAudit: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true,
    paranoid: true,
    indexes: [{
        unique: true,
        fields: ['name']
    }]
})

export default Tag