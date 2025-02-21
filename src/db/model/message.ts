import { Model, DataTypes } from 'sequelize'
import sequelize from '../seq'
import User from './user'

export interface MessageCreationAttributes {
  senderId: number
  receiverId: number
  relationId: number
  content: string  
  messageType: string
}

class Message extends Model {
  public id!: number
  public senderId!: number
  public receiverId!: number
  public content!: string
  public relationId!: number
  public messageType!: string // 例如 text, image 等
  public status!: number // 未读（unread）或者已读（read）
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
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  content: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  relationId: {
    type: DataTypes.INTEGER
  },
  messageType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'text', // 默认是文本消息
  },
  status: {
    type: DataTypes.INTEGER,    
    allowNull: false,
    defaultValue: 0, // 默认消息为未读
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
