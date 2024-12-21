import supertest from "supertest";
import {
  createTestContact,
  createTestUser,
  getTestContact,
  removeAllTestContacts,
  removeTestUser,
} from "./test-util.js";
import { web } from "../src/application/web.js";

beforeAll(async () => {
  await removeAllTestContacts();
  await removeTestUser();
});

describe("POST /api/contacts", () => {
  beforeEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
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

describe("GET /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it("should can get contact", async () => {
    const testContact = await getTestContact();
    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id)
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact.id);
    expect(result.body.data.first_name).toBe(testContact.first_name);
    expect(result.body.data.last_name).toBe(testContact.last_name);
    expect(result.body.data.email).toBe(testContact.email);
    expect(result.body.data.phone).toBe(testContact.phone);
  });

  it("should return 404 if contact id is not found", async () => {
    const testContact = await getTestContact();
    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id + 1)
      .set("Authorization", "test");

    expect(result.status).toBe(404);
    expect(result.body.data).toBeUndefined();
  });
});
