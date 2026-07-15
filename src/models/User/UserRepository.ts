import { BaseRepository } from '../../base/BaseRepository.ts';
import { UserSchema } from './User.ts';
import { IUser } from './IUser.ts';
import { Model, ClientSession } from 'mongoose';
import { getLibraryDB } from '../../database/db/libraryDB.ts';

class UserRepository extends BaseRepository<IUser> {
	constructor(
		model?: Model<IUser>
	) {
		super(model || getLibraryDB().model<IUser>('User', UserSchema));
	}
	async findByIdWithSession(id: string, session: ClientSession) {
		return this.model.findById(id, null, { session });
	}
}

export { UserRepository };