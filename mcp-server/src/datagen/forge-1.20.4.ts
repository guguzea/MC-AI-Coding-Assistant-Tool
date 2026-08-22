import { toPascalCase } from "./common.js";

/**
 * Forge 1.20.4 RecipeProvider：一参 PackOutput + buildRecipes(RecipeOutput)。
 * 依据 data/forge_1.20.4/extracted 索引核实：FinishedRecipe 类在 1.20.4 已不存在，
 * RecipeProvider.buildRecipes(RecipeOutput)、RecipeBuilder.save(RecipeOutput, String)。
 * GatherDataEvent/ExistingFileHelper 包名沿 1.20.1 同分支外推（net.minecraftforge.data.event），
 * 修改前必须用 search_forge_docs(version=1.20.4) 复核。
 */
export function generateRecipe(modId: string, targetName: string, classBase?: string): string {
  const pascalName = classBase || toPascalCase(modId);
  return `// 修改此骨架前必须用 search_forge_docs(version=1.20.4) 复核；禁止邻档 API。
// Recipe Provider — Forge 1.20.4 (${modId}:${targetName})
// 1.20.2+ vanilla：buildRecipes(RecipeOutput)；不要抄 1.20.1 的 Consumer 双参形态。
package com.example.${modId}.datagen;

import net.minecraft.data.PackOutput;
import net.minecraft.data.recipes.RecipeCategory;
import net.minecraft.data.recipes.RecipeOutput;
import net.minecraft.data.recipes.RecipeProvider;
import net.minecraft.data.recipes.ShapedRecipeBuilder;
import net.minecraft.data.recipes.SimpleCookingRecipeBuilder;
import net.minecraft.world.item.Items;
import net.minecraft.world.item.crafting.Ingredient;
import net.minecraftforge.data.event.GatherDataEvent;

public class ${pascalName}RecipeProvider extends RecipeProvider {
    public ${pascalName}RecipeProvider(PackOutput output) {
        super(output);
    }

    @Override
    protected void buildRecipes(RecipeOutput output) {
        ShapedRecipeBuilder.shaped(RecipeCategory.MISC, Items.DIAMOND)
            .pattern("ABA")
            .pattern("CDC")
            .pattern("ABA")
            .define('A', Items.DIAMOND)
            .define('B', Items.EMERALD)
            .define('C', Items.IRON_INGOT)
            .define('D', Items.AIR)
            .unlockedBy("has_diamond", has(Items.DIAMOND))
            .save(output, "${modId}:${targetName}");

        SimpleCookingRecipeBuilder.smelting(
                Ingredient.of(Items.DIRT),
                RecipeCategory.MISC,
                Items.DIAMOND, 0.1f, 200)
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
