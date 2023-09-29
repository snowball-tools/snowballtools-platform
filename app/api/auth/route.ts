import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { address } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { address },
  });

  if (existingUser) {
    const token = jwt.sign(
      { id: existingUser.id, username: existingUser.username },
      "secret",
      {
        expiresIn: "1h",
      },
    );
    res.status(200).json({ token, username: existingUser.username });
  } else {
    const newUser = await prisma.user.create({
      data: { address },
    });

    const token = jwt.sign(
      { id: newUser.id, address: newUser.address },
      "secret",
      {
        expiresIn: "1h",
      },
    );

    res.status(201).json({ token, address: newUser.address });
  }
}
