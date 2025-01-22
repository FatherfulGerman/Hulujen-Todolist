import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const title: string = body.title;
    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Title is required and must be a string." },
        { status: 400 }
      );
    }

    const result = await prisma.todolist.create({
      data: { id: uuidv4(), title },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Invalid payload." },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const result = await prisma.todolist.findMany();

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Invalid payload." },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();

    if (Array.isArray(body)) {
      const tasks = body.map((task, index) => {
        if (!task.text || typeof task.text !== "string") {
          throw new Error(`Task at index ${index} is invalid.`);
        }
        return { id: uuidv4() };
      });

      return NextResponse.json(tasks, { status: 201 });
    }

    const id: string = body.id;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Id is required and must be a string." },
        { status: 400 }
      );
    }

    const result = await prisma.todolist.delete({
      where: { id: id },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Invalid payload." },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const _id = req?.nextUrl?.searchParams.get("id");
    if (!_id) {
      return NextResponse.json(
        { error: "Missing or invalid id parameter." },
        { status: 400 }
      );
    }

    const body = await req.json();
    console.log("Request body received:", body);

    const text: string = body.title;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "on" }, { status: 400 });
    }

    const updateList = await prisma.todolist.update({
      where: { id: _id },
      data: { title: text },
    });

    return NextResponse.json(updateList, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred." },
      { status: 500 }
    );
  }
}
