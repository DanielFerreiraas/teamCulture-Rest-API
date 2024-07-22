import { Db, ObjectId } from "mongodb";

const collectionName = "sessions";

export interface SessionInput {
  userId: string;
  token: string;
}

export interface Session {
  _id?: ObjectId;
  userId: string;
  token: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class SessionRepository {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async create(session: Session): Promise<Session | null> {
    try {
      session.createdAt = new Date();
      session.updatedAt = new Date();

      const result = await this.db
        .collection<Session>(collectionName)
        .insertOne(session);
      if (result.acknowledged) {
        return { _id: result.insertedId, ...session };
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async findByToken(token: string): Promise<Session | null> {
    try {
      const session = await this.db
        .collection<Session>(collectionName)
        .findOne({ token });
      return session;
    } catch (error) {
      return null;
    }
  }

  async findOne(id: string): Promise<Session | null> {
    try {
      const session = await this.db
        .collection<Session>(collectionName)
        .findOne({ _id: new ObjectId(id) });
      return session;
    } catch (error) {
      return null;
    }
  }

  async findByUserId(userId: string): Promise<Session | null> {
    try {
      const session = await this.db
        .collection<Session>(collectionName)
        .findOne({ userId });
      return session;
    } catch (error) {
      return null;
    }
  }

  async update(id: string, updatedSession: Partial<Session>): Promise<boolean> {
    try {
      const result = await this.db
        .collection<Session>(collectionName)
        .updateOne({ _id: new ObjectId(id) }, { $set: updatedSession });

      return result.modifiedCount > 0;
    } catch (error) {
      return false;
    }
  }
}
