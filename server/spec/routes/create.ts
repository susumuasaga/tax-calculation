import { Model, Document } from 'express-cassandra';

/**
 * Create many instances of a model in the database.
 */
export async function create(model: Model<Document>, values: any[]): Promise<void> {
  for (const value of values) {
    const document = new model(value);
    await document.saveAsync();
  }
}
