import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

/*
(Feel free to delete this, but it's good to remember...)
			Drizzle Cheat Sheet:
			Operators:
		$eq = equal
		$ne = not equal
		$gt = grater than
		$gte = grater than equal
		$lt = less than
		$lte = less than equal
		$in (inArray) = in array
		$nin (notInArray) = not in
		$and = logical and
		$or = logical or

		*/

export default defineConfig({
  out: './drizzle',
  schema: './src/drizzle/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
