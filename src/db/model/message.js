const { DataTypes } = require('sequelize')
const { sequelize } = require('../seq')
const User = require('./user')

const Message = sequelize.define('message', {
  title: DataTypes.STRING,
  relationId: DataTypes.INTEGER,
  type: DataTypes.ENUM('like', 'collect', 'follow', 'system', 'comment'),
  isSystem: DataTypes.BOOLEAN,
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
}, {
    timestamps: true
})

// 关联关系(发送者)
User.hasOne(Message, { foreignKey: 'senderId' })
Message.belongsTo(User)
// 关联关系(接收者)
User.hasOne(Message, { foreignKey: 'receiverId' })
Message.belongsTo(User)

module.exports = Message