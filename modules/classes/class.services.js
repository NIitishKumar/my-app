import { Class } from './index.js'

const createClassServices = async (body) => {
    try {
        const newClass = await Class.create(body);
        return newClass
    } catch (error) {
        throw error
    }
}

export { createClassServices }