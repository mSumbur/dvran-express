// const {
//     User,
//     UserFollow,
//     Article, Tag, Media, Message,
//     ArticleTag,
//     ArticleMedia,
//     ArticleLike,
//     ArticleCollect
// } = require('./model')
import { User,
    UserFollow,
    Article, Tag, Media, Message,
    ArticleTag,
    ArticleMedia,
    ArticleLike,
    ArticleCollect } from "./model"

export async function initDB() {
    await User.sync({ alter: true })
    await UserFollow.sync({ alter: true })
    await Article.sync({ alter: true })
    await Tag.sync({ alter: true })
    await Media.sync({ alter: true })
    await Message.sync({ alter: true })
    await ArticleTag.sync({ alter: true })
    await ArticleMedia.sync({ alter: true })
    await ArticleLike.sync({ alter: true })
    await ArticleCollect.sync({ alter: true })
}