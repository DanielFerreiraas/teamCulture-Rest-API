import { Collection, Db, Document, ObjectId, WithId } from "mongodb";
import { serverError } from "../../settings/utils/helpers";

const collectionName = "permissions";

export interface Permission {
  _id?: ObjectId;
  name: string;
  description: string;
  createdAt?: Date;
}

export class PermissionRepository {
  private db: Db;
  private collection: Collection;

  constructor(db: Db) {
    this.db = db;
    this.collection = db.collection(collectionName);
  }

  async create(permission: Permission): Promise<Permission> {
    try {
      permission.createdAt = new Date();
      const result = await this.collection.insertOne(permission);
      return { ...permission, _id: result.insertedId };
    } catch (error) {
      serverError("Error create permission");
      throw error;
    }
  }

  async findByName(name: string): Promise<Permission | null> {
    try {
      const document = await this.collection.findOne({ name });
      return document ? this.mapDocumentToPermission(document) : null;
    } catch (error) {
      serverError("Error search by name");
      return null;
    }
  }

  async findMany(
    page: number,
    pageSize: number
  ): Promise<{ total: number; data: Permission[] } | null> {
    try {
      const total = await this.collection.countDocuments();
      const documents = await this.collection
        .find({})
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .toArray();
      const data = documents.map(this.mapDocumentToPermission);

      return { total, data };
    } catch (error) {
      serverError("Error search permission");
      return null;
    }
  }

  async findByIds(ids: ObjectId[]): Promise<Permission[] | null> {
    try {
      const documents = await this.collection
        .find({ _id: { $in: ids } })
        .toArray();
      return documents.map(this.mapDocumentToPermission);
    } catch (error) {
      serverError("Error search by Ids");
      return null;
    }
  }

  private mapDocumentToPermission(doc: WithId<Document>): Permission {
    return {
      _id: doc._id,
      name: doc.name,
      description: doc.description,
      createdAt: doc.createdAt,
    };
  }
}
