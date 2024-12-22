import supertest from "supertest";
import { web } from "../src/application/web.js";
import {
  createManyTestContacts,
  createTestContact,
  createTestUser,
  getTestContact,
  removeAllTestAddresses,
  removeAllTestContacts,
  removeTestUser,
} from "./test-util.js";

describe("POST /api/contacts/:contactId/addresses", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  });

  it("should can create address", async () => {
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
    expect(result.body.data.street).toBe("Jl.Tan Malaka");
    expect(result.body.data.city).toBe("Cikarang Barat, Bekasi");
    expect(result.body.data.province).toBe("Jawa Barat");
    expect(result.body.data.country).toBe("Indonesia");
    expect(result.body.data.postal_code).toBe("17530");
  });
});
