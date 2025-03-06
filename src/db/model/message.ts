import { Model, DataTypes } from 'sequelize'
import sequelize from '../seq'
import User from './user'

// export interface MessageCreationAttributes {
//   senderId: number
//   receiverId: number
//   relationId: number
//   content: string  
//   messageType: string
// }

class Message extends Model {
  public id!: number
  public senderId!: number    // 发送者id
  public receiverId!: number  // 接收者id
  public content?: string     // 内容
  public relationId?: number  // 链接内容id
  public type!: number        // 1点赞 2收藏 3评论 4关注 5官方 
  public status!: boolean     // 未读（unread）或者已读（read）
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Message.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // 假设 User 模型已经定义
      key: 'id',
    },
  },
  receiverId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  content: DataTypes.STRING(1000),
  relationId: DataTypes.INTEGER,
  type: DataTypes.INTEGER,
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  sequelize,
  modelName: 'Message',
  tableName: 'messages', // 表名
  timestamps: true, // 使用 Sequelize 自动添加 createdAt 和 updatedAt 字段
})

// 定义与 User 的关系
Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' })
Message.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId' })

export default Message
