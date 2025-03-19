import { DataTypes, Model } from "sequelize"
import sequelize from "../seq"

class UserModel extends Model {
    public id!: number
    public nickname!: string    // 昵称
    public username!: string    // 用户名
    public password!: string    // 密码
    public avatar!: string      // 头像
    public bio!: string         // 简介
    public gender!: number      // 性别
    public openid!: string      
    public unionid!: string
    public phone!: string       // 电话
    public ipaddress!: string   // ip地址
    public isAdmin!: boolean    // 是否管理
    public birthday!: string    // 生日

    public readonly followers?: UserModel[]
    public readonly following?: UserModel[]
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
}

UserModel.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
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
    unionid: DataTypes.STRING,
    phone: DataTypes.STRING,
    ipaddress: DataTypes.STRING,
    birthday: DataTypes.STRING,
    isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    sequelize,
    modelName: 'user',
    timestamps: true,
    paranoid: true,
    indexes: [{
        unique: true,
        fields: ['openid']
    }]
})

export default UserModel