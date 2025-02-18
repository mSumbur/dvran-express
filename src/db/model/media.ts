import { DataTypes, Model, Optional } from "sequelize"
import sequelize from "../seq"

export interface MediaAttributes {
    id: number
    type: string
    hash: string
    key: string
    url: string
    width: number
    height: number
    size: number
    openid?: string | null
    deletedAt?: Date | null
}

export interface MediaCreationAttributes extends Optional<MediaAttributes, 'id' | 'openid' | 'deletedAt'> {}

export class Media extends Model<MediaAttributes, MediaCreationAttributes> implements MediaAttributes {
    public id!: number
    public type!: string
    public hash!: string
    public key!: string
    public url!: string
    public width!: number
    public height!: number
    public size!: number
    public openid?: string | null | undefined
    public deletedAt?: Date | null | undefined

    public readonly createdAt!: Date
    public readonly updatedAt!: Date
}

Media.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    type: DataTypes.STRING,
    hash: DataTypes.STRING,
    key: DataTypes.STRING,
    url: { type: DataTypes.STRING, allowNull: false },
    width: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    size: DataTypes.INTEGER,
    openid: DataTypes.STRING
}, {
    sequelize,
    modelName: 'media',
    timestamps: true,
    paranoid: true
})

// const Media = sequelize.define('media', {
//     type: DataTypes.STRING,
//     hash: DataTypes.STRING,    
//     key: DataTypes.STRING,
//     url: DataTypes.STRING,
//     width: DataTypes.INTEGER,
//     height: DataTypes.INTEGER,
//     size: DataTypes.INTEGER,  
//     openid: DataTypes.STRING,
//     isAudit: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false
//     }
// }, {
//     timestamps: true,
//     paranoid: true
// })

export default Media