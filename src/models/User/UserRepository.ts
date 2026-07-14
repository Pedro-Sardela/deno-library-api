import { BaseRepository } from '../../base/BaseRepository.ts';
import { UserSchema } from './User.ts';
import { IUser } from './IUser.ts';
import { Model, ClientSession } from 'mongoose';
import { LibraryDB } from '../../database/db/libraryDB.ts';

class UserRepository extends BaseRepository<IUser> {
	constructor(
		model: Model<IUser> = LibraryDB.model<IUser>(
			'User',
			UserSchema,
		),
	) {
		super(model);
	}
	async findByIdWithSession(id: string, session: ClientSession) {
		return this.model.findById(id, null, { session });
	}
}

export { UserRepository };