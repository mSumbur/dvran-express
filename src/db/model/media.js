const { DataTypes } = require('sequelize')
const { sequelize } = require('../seq')

const Media = sequelize.define('media', {
    type: DataTypes.ENUM('image', 'video', 'audio'),
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

module.exports = Media