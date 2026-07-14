import { BaseRepository } from '../../base/BaseRepository.ts';
import { UserSchema } from './User.ts';
import { IUser } from './IUser.ts';
import { Model } from 'mongoose';
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
}

export { UserRepository };