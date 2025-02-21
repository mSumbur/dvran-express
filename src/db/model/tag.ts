import { DataTypes } from "sequelize"
import sequelize from "../seq"

const Tag = sequelize.define('tag', {    
    name: { type: DataTypes.STRING, allowNull: false },
    image: DataTypes.STRING,
    description: DataTypes.TEXT,
    openid: DataTypes.STRING,
    isRecommend: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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