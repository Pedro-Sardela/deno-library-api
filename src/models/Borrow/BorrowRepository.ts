import { BaseRepository } from '../../base/BaseRepository.ts';
import { BorrowSchema } from './Borrow.ts';
import { IBorrow } from './IBorrow.ts';
import { Model, ClientSession, Schema } from 'mongoose';
import { getLibraryDB } from '../../database/db/libraryDB.ts';

class BorrowRepository extends BaseRepository<IBorrow> {
	constructor(
			model?: Model<IBorrow>
		) {
			super(model || getLibraryDB().model<IBorrow>('Borrow', BorrowSchema));
		}

	async createWithSession(data: IBorrow, session: ClientSession){
		return this.model.create([data], { session }).then((docs) => docs?.[0]);
	}
	async findByIdWithSession(id: string, session: ClientSession) {
		return this.model.findById(id, null, { session });
	}

	async findByUserId(userId: string, options?: {limit?: number, skip?: number, sort?: any}): Promise<IBorrow[]> {
		return await this.model.find(
			{userId},
			null,
			{
				limit: options?.limit,
				skip: options?.skip,
				sort: options?.sort || { createdAt: -1 }
			}
		);
	}
	async findByBookId(bookId: string, options?: {limit?: number, skip?: number, sort?: any}): Promise<IBorrow[]> {
		return await this.model.find(
			{bookId},
			null,
			{
				limit: options?.limit,
				skip: options?.skip,
				sort: options?.sort || { createdAt: -1 }
			}
		);
	}


}

export { BorrowRepository };