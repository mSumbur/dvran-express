import { model, Schema, Types } from "mongoose";
import { createSchema, IBaseModel } from "./types";

export enum IUserActionsType {
    follow = 1,
    block = 2
}

export interface IUserActions extends IBaseModel {
    targetUserId: Types.ObjectId
    userId: Types.ObjectId
    type: IUserActionsType
}

const userActionsSchema = createSchema<IUserActions>({
    targetUserId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    type: {
        type: Number,
        enum: Object.values(IUserActionsType),
    }
})

export const UserActionsModel = model<IUserActions>('user_actions', userActionsSchema)