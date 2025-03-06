import { DataTypes, Model } from "sequelize"
import sequelize from "../seq"

class UserModel extends Model {
    public id!: number
    public nickname!: string
    public username!: string
    public password!: string
    public avatar!: string
    public bio!: string
    public gender!: number
    public openid!: string
    public unionid!: string
    public phone!: string
    public ipaddress!: string
    public isAdmin!: boolean
    public birthday!: string

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