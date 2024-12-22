import supertest from "supertest";
import { web } from "../src/application/web.js";
import {
  createTestAddress,
  createTestContact,
  createTestUser,
  getTestAddress,
  getTestContact,
  removeAllTestAddresses,
  removeAllTestContacts,
  removeTestUser,
} from "./test-util.js";
import { logger } from "../src/application/logging.js";

describe("POST /api/contacts/:contactId/addresses", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  });

  it("should can create new address", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .post("/api/contacts/" + testContact.id + "/addresses")
      .set("Authorization", "test")
      .send({
        street: "Jl.Tan Malaka",
        city: "Cikarang Barat, Bekasi",
        province: "Jawa Barat",
        country: "Indonesia",
        postal_code: "17530",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.street).toBe("Jl.Tan Malaka");
    expect(result.body.data.city).toBe("Cikarang Barat, Bekasi");
    expect(result.body.data.province).toBe("Jawa Barat");
    expect(result.body.data.country).toBe("Indonesia");
    expect(result.body.data.postal_code).toBe("17530");
  });

  it("should reject if address request is invalid", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .post("/api/contacts/" + testContact.id + "/addresses")
      .set("Authorization", "test")
      .send({
        street: "Jl.Tan Malaka",
        city: "Cikarang Barat, Bekasi",
        province: "Jawa Barat",
        country: null,
        postal_code: "17530",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if contact is not found", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .post("/api/contacts/" + (testContact.id + 1) + "/addresses")
      .set("Authorization", "test")
      .send({
        street: "Jl.Tan Malaka",
        city: "Cikarang Barat, Bekasi",
        province: "Jawa Barat",
        country: "Indonesia",
        postal_code: "17530",
      });

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
    expect(result.body.errors).toBe("contact is not found");
  });
});

describe("GET /api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  });

  it("should can get contact address", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    expect(testAddress.contact_id).toBe(testContact.id);

    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id + "/addresses/" + testAddress.id)
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.street).toBe("Jl.Tan Malaka");
    expect(result.body.data.city).toBe("Cikarang Barat, Bekasi");
    expect(result.body.data.province).toBe("Jawa Barat");
    expect(result.body.data.country).toBe("Indonesia");
    expect(result.body.data.postal_code).toBe("17530");
  });

  it("should reject if user is invalid", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    expect(testAddress.contact_id).toBe(testContact.id);

    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id + "/addresses/" + testAddress.id)
      .set("Authorization", "salah");

    expect(result.status).toBe(401);
  });

  it("should reject if contact is not found", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    expect(testAddress.contact_id).toBe(testContact.id);

    const result = await supertest(web)
      .get(
        "/api/contacts/" + (testContact.id + 1) + "/addresses/" + testAddress.id
      )
      .set("Authorization", "test");

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
    expect(result.body.errors).toBe("contact is not found");
  });

  it("should reject if address is not found", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    expect(testAddress.contact_id).toBe(testContact.id);

    const result = await supertest(web)
      .get(
        "/api/contacts/" + testContact.id + "/addresses/" + (testAddress.id + 1)
      )
      .set("Authorization", "test");

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
    expect(result.body.errors).toBe("address is not found");
  });
});

describe("PUT /api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  });

  it("should can update address", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    expect(testAddress.contact_id).toBe(testContact.id);

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id + "/addresses/" + testAddress.id)
      .set("Authorization", "test")
      .send({
        street: "Jl.Soekarno",
        city: "Blitar",
        province: "Jawa Timur",
        country: "Indonesia",
        postal_code: "62353",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.street).toBe("Jl.Soekarno");
    expect(result.body.data.city).toBe("Blitar");
    expect(result.body.data.province).toBe("Jawa Timur");
    expect(result.body.data.country).toBe("Indonesia");
    expect(result.body.data.postal_code).toBe("62353");
  });

  it("should reject if user is invalid", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    expect(testAddress.contact_id).toBe(testContact.id);

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id + "/addresses/" + testAddress.id)
      .set("Authorization", "salah")
      .send({
        street: "Jl.Soekarno",
        city: "Blitar",
        province: "Jawa Timur",
        country: "Indonesia",
        postal_code: "62353",
      });

    expect(result.status).toBe(401);
  });

  it("should reject if contact is not found", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    expect(testAddress.contact_id).toBe(testContact.id);

    const result = await supertest(web)
      .put(
        "/api/contacts/" + (testContact.id + 1) + "/addresses/" + testAddress.id
      )
      .set("Authorization", "test")
      .send({
        street: "Jl.Soekarno",
        city: "Blitar",
        province: "Jawa Timur",
        country: "Indonesia",
        postal_code: "62353",
      });

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
    expect(result.body.errors).toBe("contact is not found");
  });

  it("should reject if address is not found", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    expect(testAddress.contact_id).toBe(testContact.id);

    const result = await supertest(web)
      .put(
        "/api/contacts/" + testContact.id + "/addresses/" + (testAddress.id + 1)
      )
      .set("Authorization", "test")
      .send({
        street: "Jl.Soekarno",
        city: "Blitar",
        province: "Jawa Timur",
        country: "Indonesia",
        postal_code: "62353",
      });

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
    expect(result.body.errors).toBe("address is not found");
  });
});
