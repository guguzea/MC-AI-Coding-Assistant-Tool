import { toPascalCase } from "./common.js";

/** NeoForge 1.20.4 RecipeProvider：一参 PackOutput + buildRecipes(RecipeOutput)。不要套 1.21 两参构造。 */
export function generateRecipe(modId: string, targetName: string, classBase?: string): string {
  const pascalName = classBase || toPascalCase(modId);
  return `// 修改此骨架前必须用 search_neoforge_docs(version=1.20.4) 复核；禁止邻档 API。
// Recipe Provider — NeoForge 1.20.4 (${modId}:${targetName})
package com.example.${modId}.datagen;

import net.minecraft.data.PackOutput;
import net.minecraft.data.recipes.RecipeCategory;
import net.minecraft.data.recipes.RecipeOutput;
import net.minecraft.data.recipes.RecipeProvider;
import net.minecraft.data.recipes.ShapedRecipeBuilder;
import net.minecraft.data.recipes.SimpleCookingRecipeBuilder;
import net.minecraft.world.item.Items;
import net.minecraft.world.item.crafting.Ingredient;
import net.neoforged.neoforge.data.event.GatherDataEvent;

public class ${pascalName}RecipeProvider extends RecipeProvider {
    public ${pascalName}RecipeProvider(PackOutput output) {
        super(output);
    }

    @Override
    protected void buildRecipes(RecipeOutput output) {
        ShapedRecipeBuilder.shaped(RecipeCategory.MISC, Items.DIAMOND)
            .pattern("AAA")
            .pattern("ABA")
            .pattern("AAA")
            .define('A', Items.DIAMOND)
            .define('B', Items.EMERALD)
            .unlockedBy("has_diamond", has(Items.DIAMOND))
            .save(output, "${modId}:${targetName}");

        SimpleCookingRecipeBuilder.smelting(
                Ingredient.of(Items.DIRT), RecipeCategory.MISC, Items.DIAMOND, 0.1f, 200)
            .unlockedBy("has_dirt", has(Items.DIRT))
            .save(output, "${modId}:${targetName}_smelting");
    }

    public static void gatherData(GatherDataEvent event) {
        event.getGenerator().addProvider(
            event.includeServer(),
            ${pascalName}RecipeProvider::new);
    }
}
`;
}
