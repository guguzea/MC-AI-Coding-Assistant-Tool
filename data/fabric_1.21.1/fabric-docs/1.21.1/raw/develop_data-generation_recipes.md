# data generation recipes

> 来源：https://docs.fabricmc.net/develop/data-generation/recipes
> 版本：1.21.1
> GitHub 路径：develop/data-generation/recipes.md
> 抓取源：vitepress
> 抓取时间：2026-07-11T14:04:55.960Z
> SHA256：ace6d9882631eaa92e47570eb3cf051505fb31cfea7ab0fe40159358aff2c311
> 分支：main

# Recipe Generation 26.1.2 ​
A guide to setting up recipe generation with datagen.PREREQUISITESMake sure you've completed the datagen setup process first.

## Setup ​
First, we'll need our provider. Make a class that extends FabricRecipeProvider. All our recipe generation will happen inside the buildRecipes method of our provider.

javaimport java.util.List;
import java.util.concurrent.CompletableFuture;

import net.minecraft.core.HolderLookup;
import net.minecraft.core.registries.Registries;
import net.minecraft.data.recipes.RecipeCategory;
import net.minecraft.data.recipes.RecipeOutput;
import net.minecraft.data.recipes.RecipeProvider;
import net.minecraft.data.recipes.SimpleCookingRecipeBuilder;
import net.minecraft.resources.Identifier;
import net.minecraft.tags.ItemTags;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.Items;
import net.minecraft.world.item.crafting.CookingBookCategory;
import net.minecraft.world.item.crafting.Ingredient;

import net.fabricmc.fabric.api.datagen.v1.FabricPackOutput;
import net.fabricmc.fabric.api.datagen.v1.provider.FabricRecipeProvider;
import net.fabricmc.fabric.api.resource.conditions.v1.ResourceConditions;

import com.example.docs.ExampleMod;
import com.example.docs.item.ModItems;

public class ExampleModRecipeProvider extends FabricRecipeProvider {
	public ExampleModRecipeProvider(FabricPackOutput output, CompletableFuture<HolderLookup.Provider> registriesFuture) {
		super(output, registriesFuture);
	}

	@Override
	protected RecipeProvider createRecipeProvider(HolderLookup.Provider registryLookup, RecipeOutput exporter) {
		return new RecipeProvider(registryLookup, exporter) {
			@Override
			public void buildRecipes() {
				HolderLookup.RegistryLookup<Item> itemLookup = registries.lookupOrThrow(Registries.ITEM);
			}
		};
	}

	@Override
	public String getName() {
		return "ExampleModRecipeProvider";
	}
}12345678910111213141516171819202122232425262728293031323334353637383940414243To finish setup, add this provider to your DataGeneratorEntrypoint within the onInitializeDataGenerator method.

javapack.addProvider(ExampleModRecipeProvider::new);1
## Shapeless Recipes ​
Shapeless recipes are fairly straightforward. Just add them to the buildRecipes method in your provider:

java
shapeless(RecipeCategory.BUILDING_BLOCKS, Items.DIRT) // You can also specify an int to produce more than one
		.requires(Items.COARSE_DIRT) // You can also specify an int to require more than one, or a tag to accept multiple things
		// Create an advancement that gives you the recipe
		.unlockedBy(getHasName(Items.COARSE_DIRT), has(Items.COARSE_DIRT))
		.save(output);123456
### Dye Recipes ​
Dye recipes are used to dye items in your inventory.

javadyedItem(ModItems.LEATHER_GLOVES, "leather_gloves");1
## Shaped Recipes ​
For a shaped recipe, you define the shape using a String, then define what each char in the String represents.

javashaped(RecipeCategory.MISC, Items.CRAFTING_TABLE, 4)
		.pattern("ll")
		.pattern("ll")
		.define('l', ItemTags.LOGS) // 'l' means "any log"
		.group("multi_bench") // Put it in a group called "multi_bench" - groups are shown in one slot in the recipe book
		.unlockedBy(getHasName(Items.CRAFTING_TABLE), has(Items.CRAFTING_TABLE))
		.save(output);
shaped(RecipeCategory.MISC, Items.LOOM, 4)
		.pattern("ww")
		.pattern("ll")
		.define('w', ItemTags.WOOL) // 'w' means "any wool"
		.define('l', ItemTags.LOGS)
		.group("multi_bench")
		.unlockedBy(getHasName(Items.LOOM), has(Items.LOOM))
		.save(output);
doorBuilder(Items.OAK_DOOR, Ingredient.of(Items.OAK_BUTTON)) // Using a helper method!
		.unlockedBy(getHasName(Items.OAK_BUTTON), has(Items.OAK_BUTTON))
		.save(output);123456789101112131415161718TIPThere's a lot of helper methods for creating common recipes. Check out what RecipeProvider has to offer! Use Alt+7 in IntelliJ to open the structure of a class, including a method list.

## Other Recipes ​
Other recipes work similarly, but require a few extra parameters. For example, smelting recipes need to know how much experience to award.

javaoreSmelting(
		List.of(Items.GLASS_BOTTLE), // Inputs
		RecipeCategory.MISC, // Category
		CookingBookCategory.MISC, // Category
		Items.GLASS, // Output
		0.1f, // Experience
		300, // Cooking time
		"glass_bottle_to_glass" // group
);123456789Smoking is a little different, it does not use the same recipe generator as smelter-like blocks do.

javaSimpleCookingRecipeBuilder.smoking(
		Ingredient.of(Items.WATER_BUCKET), // Input
		RecipeCategory.MISC, // Category (MISC for smoking recipes)
		Items.BUCKET, // Output
		0.35f, // Experience
		100 // Cooking Time
)
		.unlockedBy(getHasName(Items.WATER_BUCKET), has(Items.WATER_BUCKET)) // You can specify how this recipe is unlocked here.
		.save(output, Identifier.fromNamespaceAndPath(ExampleMod.MOD_ID, "water_bucket_to_bucket").toString()); // Then save the recipe with your modid and the recipe name.123456789
## Resource Conditions ​
To apply a resource condition to a data generated recipe, wrap the output with withConditions and provide any resource conditions you want to apply. This will then generate a recipe and an advancement that has resource conditions applied:

javashapeless(RecipeCategory.BUILDING_BLOCKS, Items.SAND)
		.requires(ItemTags.SAND)
		.unlockedBy(getHasName(Items.SAND), has(Items.SAND))
		.save(withConditions(output, ResourceConditions.tagsPopulated(ItemTags.DIRT))); // Instead of providing the output directly, wrap it with withConditions1234Copied