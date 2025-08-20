import { Model, FilterQuery, PopulateOptions } from 'mongoose'

interface FindAndCountOptions {
    page?: number
    count?: number
    sort?: Record<string, 1 | -1>
    populate?: PopulateOptions | PopulateOptions[]
}

export async function findAndCountAll<T>(
    model: Model<T>,
    query: FilterQuery<T> = {},
    options: FindAndCountOptions = {}
): Promise<{ page: number, count: number; total: number, data: T[] }> {
    const page = options.page ?? 1
    const pageSize = options.count ?? 10
    const skip = (page - 1) * pageSize

    const findQuery = model.find(query)
        .skip(skip)
        .limit(pageSize)
        .sort(options.sort || {})
        .lean()

    if (options.populate) {
        findQuery.populate(options.populate)
    }

    const [count, rows]: any = await Promise.all([
        model.countDocuments(query),
        findQuery
    ])

    return {
        page,
        count: pageSize,
        total: count,
        data: rows
    }
}
