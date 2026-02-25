import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractDocument } from './abstract.schema';
import { Model, QueryFilter, Types, UpdateQuery } from 'mongoose';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;
  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as unknown as TDocument;
  }

  async findOne(
    queryFilter: QueryFilter<TDocument>,
  ): Promise<TDocument | null> {
    const document = await this.model
      .findOne(queryFilter)
      .lean<TDocument>(true);
    if (!document) {
      this.logger.warn('Document not found with queryFilter', queryFilter);
      throw new NotFoundException('Document not found');
    }
    return document as TDocument;
  }

  async findOneAndUpdate(
    queryFilter: QueryFilter<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument | null> {
    const document = await this.model
      .findOneAndUpdate(queryFilter, update, {
        new: true,
      })
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn('Document not found');
      throw new NotFoundException('Document not found');
    }
    return document as TDocument;
  }

  async find(queryFilter: QueryFilter<TDocument>): Promise<TDocument[]> {
    const documents = await this.model
      .find(queryFilter)
      .lean<TDocument[]>(true);
    return documents as TDocument[];
  }

  async findOneAndDelete(
    queryFilter: QueryFilter<TDocument>,
  ): Promise<TDocument | null> {
    const document = await this.model
      .findOneAndDelete(queryFilter)
      .lean<TDocument>(true);
    if (!document) {
      this.logger.warn('Document not found');
      throw new NotFoundException('Document not found');
    }
    return document as TDocument;
  }
}
