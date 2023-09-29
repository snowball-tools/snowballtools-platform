import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: { address: string; username: string } },
) {
  const { address, username } = params;

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

    NextResponse.json({ token, address: user.address });
  }
}
