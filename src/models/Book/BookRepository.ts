import { BaseRepository } from '../../base/BaseRepository.ts';
import { BookSchema } from './Book.ts';
import { IBook } from './IBook.ts';
import { Model, ClientSession } from 'mongoose';
import { getLibraryDB } from '../../database/db/libraryDB.ts';

class BookRepository extends BaseRepository<IBook> {
	constructor(
		model?: Model<IBook>
	) {
		super(model || getLibraryDB().model<IBook>('Book', BookSchema));
	}
	async findByIsbn(isbn: string){
		return this.findOne({isbn})
	}
	async borrowOne(id: string, session: ClientSession){
		return this.updateById(id, {
			$inc: {
				available: -1
			}
		}, session);
	}
	async returnOne(id: string, session: ClientSession) {
		return this.updateById(id, {
			$inc: {
				available: 1
			}
		}, session);
	}
	async findByIdWithSession(id: string, session: ClientSession) {
		return this.model.findById(id, null, { session });
	}
}

export { BookRepository };