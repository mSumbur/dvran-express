import { model, Schema, Types } from "mongoose";
import { createSchema, IBaseModel } from "./types";

export enum IUserActionType {
    follow = 1,
    block = 2
}

export interface IUserAction extends IBaseModel {
    targetUserId: Types.ObjectId
    userId: Types.ObjectId
    type: IUserActionType
}

const userActionSchema = createSchema<IUserAction>({
    targetUserId: { type: Schema.Types.ObjectId, ref: 'users' },
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    type: { type: Number, enum: IUserActionType }
})

const UserActionModel = model<IUserAction>('user_actions', userActionSchema)

export default UserActionModel