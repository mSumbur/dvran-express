const { DataTypes } = require('sequelize')
const { sequelize } = require('../seq')

const User = sequelize.define('user', {
    nickname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING
    },
    avatar: DataTypes.STRING,
    bio: DataTypes.TEXT,
    gender: DataTypes.INTEGER,    
    openid: DataTypes.STRING,
    unionid: { type: DataTypes.STRING, allowNull: true },
    phone: DataTypes.STRING,
    ipaddress: DataTypes.STRING,
    birthday: {
        type: DataTypes.STRING
    }
}, {
    timestamps: true
})

module.exports = User