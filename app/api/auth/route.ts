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

  const { address, username } = req.body;

  let user = await prisma.user.findUnique({
    where: { address },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { address, username },
    });
  } else {
    const token = jwt.sign({ id: user.id, address: user.address }, "secret", {
      expiresIn: "1h",
    });

    res.status(201).json({ token, address: user.address });
  }
}
