import mongoose, { Schema, model, models } from "mongoose";

const RecipeSchema = new Schema(
  {
    title: { type: String, required: true },
    ingredients: { type: [String], required: true },
    steps: { type: [String], required: true },
    sourceUrl: { type: String, required: true },
    userEmail: { type: String, required: true }, // To associate recipe with logged-in user
  },
  { timestamps: true }
);

const Recipe = models.Recipe || model("Recipe", RecipeSchema);

export default Recipe;
