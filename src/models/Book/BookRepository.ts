import { BaseRepository } from '../../base/BaseRepository.ts';
import { BookSchema } from './Book.ts';
import { IBook } from './IBook.ts';
import { Model } from 'mongoose';
import { LibraryDB } from '../../database/db/libraryDB.ts';

class BookRepository extends BaseRepository<IBook> {
	constructor(
		model: Model<IBook> = LibraryDB.model<IBook>(
			'Book',
			BookSchema,
		),
	) {
		super(model);
	}
	async findByIsbn(isbn: string){
		return this.findOne({isbn})
	}
}

export { BookRepository };