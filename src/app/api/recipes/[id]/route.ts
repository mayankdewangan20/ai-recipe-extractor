import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectToDatabase from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ error: "Recipe ID is required" }, { status: 400 });
    }

    await connectToDatabase();

    // Ensure the recipe belongs to the user before deleting
    const deletedRecipe = await Recipe.findOneAndDelete({ 
      _id: id, 
      userEmail: session.user.email 
    });

    if (!deletedRecipe) {
      return NextResponse.json({ error: "Recipe not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Recipe deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting recipe:", error);
    return NextResponse.json({ error: "Failed to delete recipe" }, { status: 500 });
  }
}
