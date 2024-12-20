import supertest from "supertest";
import { prismaClient } from "../src/application/database.js";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";

describe("POST /api/users", () => {
  afterEach(async () => {
    await prismaClient.user.deleteMany({
      where: {
        username: "khannedy",
      },
    });
  });

  it("should can register new user", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "khannedy",
      password: "rahasia",
      name: "Eko Kurniawan",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("khannedy");
    expect(result.body.data.name).toBe("Eko Kurniawan");
    expect(result.body.data.password).toBeUndefined();
  });

  it("should reject is request is invalid", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "",
      password: "",
      name: "",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});
