import supertest from "supertest";
import {
  createTestUser,
  removeAllTestContacts,
  removeTestUser,
} from "./test-util.js";
import { web } from "../src/application/web.js";

beforeAll(async () => {
  await removeAllTestContacts();
  await removeTestUser();
});

describe("POST /api/contacts", () => {
  beforeAll(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it("should can create new contact", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", "test")
      .send({
        first_name: "Doni",
        last_name: "Darmawan",
        email: "doni@gmail.com",
        phone: "123456789",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.first_name).toBe("Doni");
    expect(result.body.data.last_name).toBe("Darmawan");
    expect(result.body.data.email).toBe("doni@gmail.com");
    expect(result.body.data.phone).toBe("123456789");
  });

  it("should reject if request is invalid", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", "salah")
      .send({
        first_name: "Doni",
        last_name: "Darmawan",
        email: "doni@gmail.com",
        phone: "123456789",
      });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
    expect(result.body.data).toBeUndefined();
  });
});
