import { patchIssueSchema } from "@/app/createIssueSchema";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authoOptions from "@/app/auth/authOptions";

//Two params: a request and a route param object
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authoOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  const body = await request.json();
  const validation = patchIssueSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const { assignedToUserId, title } = body;
  if (assignedToUserId) {
    const user = await prisma.user.findUnique({
      where: {
        id: assignedToUserId,
      },
    });
    if (!user)
      return NextResponse.json({ error: "Invalid User." }, { status: 401 });
  }

  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!issue)
    return NextResponse.json({ error: "Invalid issue. " }, { status: 404 });

  const updatedIssue = await prisma.issue.update({
    where: { id: issue.id },
    data: {
      title,
      decription: body.description,
      assignedToUserId,
    },
  });

  return NextResponse.json(updatedIssue);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authoOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!issue) {
    return NextResponse.json({ error: "Invalid Issue" }, { status: 404 });
  }

  await prisma.issue.delete({
    where: { id: issue.id },
  });

  return NextResponse.json({});
}
