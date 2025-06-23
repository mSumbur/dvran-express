import { Schema, SchemaOptions } from "mongoose"

export interface IBaseModel {
    _id?: string
    createdAt?: Date
    updatedAt?: Date
    isDeleted?: boolean
}

export interface IUGCModel {
    auditStatus?: IAuditStatus
    auditReason?: string
    auditAt?: Date
    auditBy?: string
    // 推荐
    isFeatured: { type: Boolean, default: false },
    featuredAt: Date,
    featuredBy: { type: Schema.Types.ObjectId, ref: 'User' },
    // 置顶
    isPinned: boolean,
    // 
    isPublic: boolean
}

export enum IAuditStatus {
    rejected = -1,
    pending = 0,
    approved = 1
}

export function createSchema<T>(fields: Record<string, any>, options?: SchemaOptions): Schema {
    return new Schema<T>(
        {
            ...fields,
            isDeleted: { type: Boolean, default: false },
        },
        { 
            ...options,
            timestamps: true 
        }
    )
}

export function createUGCSchema<T>(fields: Record<string, any>, options?: SchemaOptions): Schema {
    return new Schema<T & IUGCModel>(
        {
            ...fields,
            auditStatus: { type: Number, enum: Object.values(IAuditStatus) },
            auditReason: String,
            auditAt: Date,
            auditBy: { type: Schema.Types.ObjectId, ref: 'users' },
            isFeatured: { type: Boolean, default: false },
            featuredAt: Date,
            featuredBy: { type: Schema.Types.ObjectId, ref: 'users' },
            isPinned: { type: Boolean, default: false },
            isPublic: { type: Boolean, default: false },
            isDeleted: { type: Boolean, default: false }
        },
        { 
            ...options,
            timestamps: true 
        }
    )
}
