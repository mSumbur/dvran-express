import { Model, DataTypes } from "sequelize"
import sequelize from "../seq"
import UserModel from "./user"

class UserFollowModel extends Model {
    public followerId!: number
    public followingId!: number
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
}

UserFollowModel.init({
    followerId: {
        type: DataTypes.INTEGER,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
    },
    followingId: {
        type: DataTypes.INTEGER,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
    }
}, {
    sequelize,
    modelName: 'user_follow',
    timestamps: true
})

UserModel.belongsToMany(UserModel, {
    as: 'followers',
    through: UserFollowModel,
    foreignKey: 'followingId',
    otherKey: 'followerId'
})

UserModel.belongsToMany(UserModel, {
    as: 'following',
    through: UserFollowModel,
    foreignKey: 'followerId',
    otherKey: 'followingId'
})

export default UserFollowModel