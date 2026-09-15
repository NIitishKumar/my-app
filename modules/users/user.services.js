import bcrypt from "bcryptjs";
import { create, findUserByEmail } from "./user.repository.js"

export const createUser = async (data) => {
    try {
        const { name, email, password, role } = data;
        if (!name || !email || !password || !role) {
            throw new Error(`All fields are required`);
        }

        const user = await findUserByEmail({ email });
        if (user) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        return await create({ name, email, password: hashedPassword, role });
    } catch (error) {
        console.log(error);
        throw error
    }
};
