import { UserSchemaLite } from '/constants/schemas/user.schema'
import { Database } from '/lib/database'

export class UserModel {
    public static async userExists(username: text): Promise<boolean> {
        return (
            (await Database.user.count({
                where: { username }
            })) > 0
        )
    }

    public static async whereUsernameLite(username: text): Promise<UserSchemaLite | null> {
        return {
            name: '',
            surname: '',
            username: username,
            role: 'ADMIN',
            avatar: ''
        }
    }
}
