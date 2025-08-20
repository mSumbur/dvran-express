import { model, Schema, Types } from "mongoose";
import { createSchema, IBaseModel } from "./types";

export enum IMessageType {
    like = 1,
    collect = 2,
    comment = 3,
    offical = 4
}

export interface IMessage extends IBaseModel {
    senderId: Types.ObjectId
    receiverId: Types.ObjectId
    relationId: Types.ObjectId
    content: string
    type: IMessageType
    isRead: boolean    
}

const messageModelSchema = createSchema<IMessage>({
    senderId: { type: Schema.Types.ObjectId, ref: 'users' },
    receiverId: { type: Schema.Types.ObjectId, ref: 'users' },
    relationId: String,
    content: String,
    isRead: { type: Boolean, default: false },
    type: { type: Number, enum: IMessageType }
})

// 虚拟字段
messageModelSchema.virtual('sender', {
    ref: 'users',
    localField: 'senderId',
    foreignField: '_id',
    justOne: true
})
messageModelSchema.set('toObject', { virtuals: true })
messageModelSchema.set('toJSON', { virtuals: true })

const MessageModel = model<IMessage>('message', messageModelSchema)

export default MessageModel