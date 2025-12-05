import { NextRequest, NextResponse } from "next/server";

// In-memory store for demo purposes (replace with database in production)
let items: { id: number; name: string; description: string; createdAt: string }[] = [];
let nextId = 1;

// POST - Create
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    const newItem = {
      id: nextId++,
      name,
      description,
      createdAt: new Date().toISOString(),
    };

    items.push(newItem);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}

// GET - Read
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const item = items.find((i) => i.id === parseInt(id));
      if (!item) {
        return NextResponse.json(
          { error: "Item not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(item);
    }

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

// PUT - Update
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, description } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const itemIndex = items.findIndex((i) => i.id === id);
    if (itemIndex === -1) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    items[itemIndex] = {
      ...items[itemIndex],
      name: name || items[itemIndex].name,
      description: description || items[itemIndex].description,
    };

    return NextResponse.json(items[itemIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}

// DELETE - Delete
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const itemIndex = items.findIndex((i) => i.id === parseInt(id));
    if (itemIndex === -1) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    const deletedItem = items.splice(itemIndex, 1);
    return NextResponse.json(deletedItem[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
