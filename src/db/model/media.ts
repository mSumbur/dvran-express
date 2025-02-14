import { DataTypes } from "sequelize"
import sequelize from "../seq"

const Media = sequelize.define('media', {
    type: DataTypes.STRING,
    hash: DataTypes.STRING,    
    key: DataTypes.STRING,
    url: DataTypes.STRING,
    width: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    size: DataTypes.INTEGER,  
    openid: DataTypes.STRING,
    isAudit: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true,
    paranoid: true
})

export default Media