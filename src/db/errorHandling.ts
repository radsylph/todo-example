import { DatabaseError } from "pg";
import { DrizzleQueryError } from "drizzle-orm";

export function handleDatabaseError(error: unknown): undefined {
    if (error instanceof DrizzleQueryError) {
      if (error.cause instanceof DatabaseError){
        console.log("error cause" , {
          errorCode: error.cause.code,
          errorName: error.name
        });
      }
    }
}