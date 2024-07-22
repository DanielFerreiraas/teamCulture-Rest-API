import { Collection, Db, Document, ObjectId, WithId } from "mongodb";
import { serverError } from "../../settings/utils/helpers";
const collectionName = "roles";

export interface Role {
  _id?: ObjectId;
  name: string;
  description: string;
  createdAt?: Date;
  permissions: ObjectId[];
}

export class RoleRepository {
  private db: Db;
  private collection: Collection;

  constructor(db: Db) {
    this.db = db;
    this.collection = db.collection(collectionName);
  }

  async create(role: Role): Promise<Role> {
    try {
      role.createdAt = new Date();
      const result = await this.collection.insertOne(role);
      return { ...role, _id: result.insertedId };
    } catch (error) {
      serverError("Error create role");
      throw error;
    }
  }

  async findByName(name: string): Promise<Role | null> {
    try {
      const document = await this.collection.findOne({ name });
      return document ? this.mapDocumentToRole(document) : null;
    } catch (error) {
      serverError("Erro search role by name");
      return null;
    }
  }

  async findMany(
    page: number,
    pageSize: number
  ): Promise<{ total: number; data: Role[] } | null> {
    try {
      const total = await this.collection.countDocuments();
      const documents = await this.collection
        .find({})
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .toArray();
      const data = documents.map(this.mapDocumentToRole);

      return { total, data };
    } catch (error) {
      serverError("Error search roles");
      return null;
    }
  }

  async findByIds(ids: ObjectId[]): Promise<Role[] | null> {
    try {
      const documents = await this.collection
        .find({ _id: { $in: ids } })
        .toArray();
      return documents.map(this.mapDocumentToRole);
    } catch (error) {
      serverError("Error search by IDs");
      return null;
    }
  }

  private mapDocumentToRole(doc: WithId<Document>): Role {
    return {
      _id: doc._id,
      name: doc.name,
      description: doc.description,
      createdAt: doc.createdAt,
      permissions: doc.permissions,
    };
  }
}
