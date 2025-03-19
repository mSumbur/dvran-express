import { DataTypes, Model } from "sequelize";
import sequelize from "../seq";

class NoteModel extends Model {
    public id!: number
    public text!: string
    public openid!: string | null
    public userId!: number
    
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
}

NoteModel.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    text: DataTypes.TEXT,
    openid: DataTypes.STRING,
    userId: DataTypes.INTEGER
}, {
    sequelize,
    timestamps: true    
})

export default NoteModel