// const {
//     User,
//     UserFollow,
//     Article, Tag, Media, Message,
//     ArticleTag,
//     ArticleMedia,
//     ArticleLike,
//     ArticleCollect
// } = require('./model')
import { 
    UserModel,
    UserFollowModel,
    ArticleModel,
    ArticleMediaModel,
    ArticleTagModel,    
    ArticleLikeModel,
    ArticleCollectModel,
    TagModel, 
    MediaModel, 
    MessageModel, 
    CommentModel,
    NodeModel,
    MdayModel
} from "./model"
import sequelize from "./seq"

export async function initDB() {
    await UserModel.sync({ alter: true })
    await UserFollowModel.sync({ alter: true })
    await ArticleModel.sync({ alter: true })
    await TagModel.sync({ alter: true })
    await MediaModel.sync({ alter: true })
    await MessageModel.sync({ alter: true })
    await CommentModel.sync({ alter: true })
    await ArticleMediaModel.sync({ alter: true })
    await ArticleTagModel.sync({ alter: true })    
    await ArticleLikeModel.sync({ alter: true })
    await ArticleCollectModel.sync({ alter: true })
    await MdayModel.sync({ alter: true })
    await NodeModel.sync({ alter: true })
    // await sequelize.sync({ force: true }); // 注意：force: true 会删除现有表并重新创建，可能导致数据丢失
}