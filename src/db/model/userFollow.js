const { sequelize } = require('../seq')
const User = require('./user')

const UserFollow = sequelize.define('user_follow', {}, { timestamps: true })

// 关联一对一关系
// UserFollow.hasOne(User, { foreignKey: 'targetUserId' })
// User.belongsTo(UserFollow)

// UserFollow.hasOne(User, { foreignKey: 'userId' })
// User.belongsTo(UserFollow)
User.hasOne(UserFollow, { foreignKey: 'targetUserId' })
UserFollow.belongsTo(User)

User.hasOne(UserFollow, { foreignKey: 'userId' })
UserFollow.belongsTo(User)

module.exports = UserFollow