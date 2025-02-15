// const { DataTypes } = require('sequelize')
// const { sequelize } = require('../seq')
import { DataTypes } from "sequelize"
import sequelize from "../seq"

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
    timestamps: true,
    indexes: [{
        unique: true,
        fields: ['openid']
    }]
})

export default User