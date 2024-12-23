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

export const createTestContact = async () => {
  await prismaClient.contact.create({
    data: {
      username: "test",
      first_name: "test",
      last_name: "test",
      email: "test@pzn.com",
      phone: "089812345",
    },
  });
};

export const getTestContact = async () => {
  return prismaClient.contact.findFirst({
    where: {
      username: "test",
    },
  });
};

export const createManyTestContacts = async () => {
  for (let i = 0; i < 15; i++) {
    await prismaClient.contact.create({
      data: {
        username: "test",
        first_name: `test ${i}`,
        last_name: `test ${i}`,
        email: `test${i}@pzn.com`,
        phone: `089812345${i}`,
      },
    });
  }
};

export const removeAllTestAddresses = async () => {
  await prismaClient.address.deleteMany({
    where: {
      contact: {
        username: "test",
      },
    },
  });
};

export const createTestAddress = async () => {
  const testContact = await getTestContact();

  await prismaClient.address.create({
    data: {
      contact_id: testContact.id,
      street: "Jl.Tan Malaka",
      city: "Cikarang Barat, Bekasi",
      province: "Jawa Barat",
      country: "Indonesia",
      postal_code: "17530",
    },
  });
};

export const getTestAddress = async () => {
  return await prismaClient.address.findFirst({
    where: {
      contact: {
        username: "test",
      },
    },
  });
};

export const createManyTestAddresses = async () => {
  const testContact = await getTestContact();

  for (let i = 0; i < 15; i++) {
    await prismaClient.address.create({
      data: {
        contact_id: testContact.id,
        street: "Jl.Tan Malaka " + i,
        city: "Cikarang Barat, Bekasi " + i,
        province: "Jawa Barat " + i,
        country: "Indonesia " + i,
        postal_code: "17530" + i,
      },
    });
  }
};
