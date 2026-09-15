import User from './user.schema.js';

const create = async ({ name, email, password, role }) => {

    try {
        const user = await new User({
            name,
            email,
            password,
            role
        })
        await user.save()
        return user
    } catch (error) {
        console.log({ error });

    }
}

const findUserByEmail = async ({ email }) => {
    const user = await User.findOne({ email });
    return user
}

const findUserByEmailAndPassword = async ({ email, password }) => {
    try {
        const user = await User.findOne({ email, password })
        return user
    } catch (error) {
        console.log(error);
        throw error
    }
}

export { create, findUserByEmail, findUserByEmailAndPassword };