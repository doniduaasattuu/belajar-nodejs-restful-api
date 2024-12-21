import { prismaClient } from "../src/application/database.js";
import bcrypt from "bcrypt";

export const removeTestUser = async () => {
  await prismaClient.user.deleteMany({
    where: {
      username: "test",
    },
  });
};

export const createTestUser = async () => {
  const password = await bcrypt.hash("rahasia", 10);

  await prismaClient.user.create({
    data: {
      username: "test",
      password: password,
      name: "test",
      token: "test",
    },
  });
};

export const getTestUser = async () => {
  const user = prismaClient.user.findUnique({
    where: {
      username: "test",
    },
  });

  return user;
};

export const removeAllTestContacts = async () => {
  await prismaClient.contact.deleteMany({
    where: {
      username: "test",
    },
  });
};
