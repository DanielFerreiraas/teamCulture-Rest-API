import { Db, ObjectId } from "mongodb";
import { serverError } from "../../settings/utils/helpers";

const collectionName = "assessments";

export interface AssessmentInput {
  userId: ObjectId;
  rating: number;
  comment: string;
}

export interface Assessment {
  _id?: ObjectId;
  userId: ObjectId;
  rating: number;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class AssessmentRepository {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async create(assessment: Assessment): Promise<void | string> {
    try {
      assessment.createdAt = new Date();
      assessment.updatedAt = new Date();

      await this.db
        .collection<Assessment>(collectionName)
        .insertOne(assessment);
    } catch (error) {
      serverError("Error create assessment");
    }
  }

  async findMany(
    page: number,
    pageSize: number,
    rating?: number,
    ratingComparison?: "gt" | "lt" | "eq",
    startDate?: Date,
    endDate?: Date
  ): Promise<{ total: number; data: Assessment[] } | null> {
    try {
      const assessmentsCollection =
        this.db.collection<Assessment>(collectionName);

      const filter: any = {};
      if (rating !== undefined) {
        switch (ratingComparison) {
          case "gt":
            filter.rating = { $gt: rating };
            break;
          case "lt":
            filter.rating = { $lt: rating };
            break;
          case "eq":
            filter.rating = rating;
            break;
          default:
            break;
        }
      }

      if (startDate)
        filter.createdAt = { ...filter.createdAt, $gte: startDate };
      if (endDate) filter.createdAt = { ...filter.createdAt, $lte: endDate };

      const total = await assessmentsCollection.countDocuments(filter);
      const data = await assessmentsCollection
        .find(filter)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .toArray();

      return { total, data };
    } catch (error) {
      serverError("Error search assessment");
      return null;
    }
  }

  async findOne(id: string): Promise<Assessment | null> {
    try {
      const assessment = await this.db
        .collection<Assessment>(collectionName)
        .findOne({ _id: new ObjectId(id) });
      return assessment;
    } catch (error) {
      serverError("Error search assessment");
      return null;
    }
  }

  async update(
    id: string,
    updatedAssessment: Partial<Assessment>
  ): Promise<void> {
    try {
      updatedAssessment.updatedAt = new Date();
      await this.db
        .collection<Assessment>(collectionName)
        .updateOne({ _id: new ObjectId(id) }, { $set: updatedAssessment });
    } catch (error) {
      serverError("Error update assessment");
      return;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.db
        .collection<Assessment>(collectionName)
        .deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      serverError("Error delete assessment");
      return;
    }
  }
}
