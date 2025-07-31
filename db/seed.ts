import { faker } from "@faker-js/faker";
import { Author, Comment, db } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  const authorIds = Array.from({ length: 18 }, () =>
    faker.string.ulid({ refDate: "2025-07-27T11:57:50.905Z" }),
  );
  const authors = authorIds.map((id) => ({ id, name: faker.person.fullName() }));

  const comments = Array.from({ length: 72 }, () => ({
    id: faker.string.ulid({ refDate: "2025-07-27T11:57:50.905Z" }),
    authorId: faker.helpers.arrayElement(authorIds),
    content: faker.hacker.phrase(),
  }));

  const requests = [db.insert(Author).values(authors), db.insert(Comment).values(comments)];

  await Promise.all(requests);
}
