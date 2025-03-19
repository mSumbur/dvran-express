import { Model, DataTypes } from "sequelize";
import sequelize from "../seq";

class MdayModel extends Model {
    public id!: number
    public text!: string
    public day!: Date
    public openid!: string | null
    public userId!: number    
    public color!: string    
    public bgImg!: string
    public bgColor!: string
    public fontSize!: number
    public fontFamily!: string
    public width!: number

    public readonly createdAt!: Date
    public readonly updatedAt!: Date
}

MdayModel.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    text: DataTypes.STRING,
    day: DataTypes.DATE,
    openid: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    color: DataTypes.STRING,
    bgImg: DataTypes.STRING,
    bgColor: DataTypes.STRING,
    fontSize: DataTypes.INTEGER,
    fontFamily: DataTypes.STRING,
    width: DataTypes.INTEGER
}, {
    sequelize,
    timestamps: true
})

export default MdayModel