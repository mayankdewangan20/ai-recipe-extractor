import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectToDatabase from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, ingredients, steps, sourceUrl } = body;

    if (!title || !ingredients || !steps || !sourceUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    const newRecipe = await Recipe.create({
      title,
      ingredients,
      steps,
      sourceUrl,
      userEmail: session.user.email,
    });

    return NextResponse.json(newRecipe, { status: 201 });
  } catch (error: any) {
    console.error("Error saving recipe:", error);
    return NextResponse.json({ error: error.message || "Failed to save recipe" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const recipes = await Recipe.find({ userEmail: session.user.email }).sort({ createdAt: -1 });

    return NextResponse.json(recipes, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 });
  }
}
