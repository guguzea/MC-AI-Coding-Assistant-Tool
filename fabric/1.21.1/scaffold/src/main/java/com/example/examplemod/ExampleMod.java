package com.example.examplemod;

import net.fabricmc.api.ModInitializer;
import net.fabricmc.fabric.api.object.builder.v1.entity.FabricDefaultAttributeRegistry;
import net.fabricmc.fabric.api.registry.FabricBlockItemRegistry;
import net.fabricmc.fabric.api.registry.Fabric flammability;
import net.fabricmc.fabric.api.registry.OxygenRegistry;
import net.fabricmc.fabric.api.registry.SleepingChanceRegistry;
import net.fabricmc.fabric.api.registry.StonecuttingRegistry;
import net.fabricmc.fabric.api.registry.VillagerRegistry;
import net.fabricmc.fabric.api.registry.composting.CompostingChanceRegistry;
import net.fabricmc.fabric.api.registry.FuelRegistry;
import net.fabricmc.fabric.api.registry.RecipeRegistry;
import net.fabricmc.fabric.api.registry.*;
import net.fabricmc.fabric.api.loot.v3.LootTableEvents;
import net.minecraft.block.Blocks;
import net.minecraft.item.Item;
import net.minecraft.item.ItemStack;
import net.minecraft.recipe.ShapedRecipe;
import net.minecraft.registry.Registries;
import net.minecraft.registry.Registry;
import net.minecraft.registry.RegistryKey;
import net.minecraft.registry.RegistryKeys;
import net.minecraft.registry.tag.ItemTags;
import net.minecraft.registry.tag.TagKey;
import net.minecraft.util.Identifier;
import net.minecraft.village.TradeOffers;
import net.minecraft.village.VillagerProfession;
import net.minecraft.world.World;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ExampleMod implements ModInitializer {
    public static final String MOD_ID = "examplemod";
    public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);

    // Example Block Registration
    // private static final Supplier<Block> EXAMPLE_BLOCK = Registry.register(
    //         Registries.BLOCK,
    //         new Identifier(MOD_ID, "example_block"),
    //         new Block(FabricBlockSettings.copyOf(Blocks.STONE).strength(4.0f))
    // );
    //
    // // BlockItem Registration
    // private static final Supplier<Item> EXAMPLE_BLOCK_ITEM = Registry.register(
    //         Registries.ITEM,
    //         new Identifier(MOD_ID, "example_block"),
    //         new BlockItem(EXAMPLE_BLOCK.get(), new Item.Settings())
    // );

    // Example Item Registration
    // private static final Supplier<Item> EXAMPLE_ITEM = Registry.register(
    //         Registries.ITEM,
    //         new Identifier(MOD_ID, "example_item"),
    //         new Item(new Item.Settings().maxCount(16))
    // );

    // Example Entity Registration
    // public static final Supplier<EntityType<ExampleAnimalEntity>> EXAMPLE_ANIMAL = Registry.register(
    //         Registries.ENTITY_TYPE,
    //         new Identifier(MOD_ID, "example_animal"),
    //         EntityType.Builder.create(
    //                 ExampleAnimalEntity::new,
    //                 MobCategory.CREATURE
    //         ).dimensions(EntityDimensions.fixed(0.75f, 0.75f)).build()
    // );

    @Override
    public void onInitialize() {
        LOGGER.info("Hello Fabric world! For Minecraft 1.21.1!");

        // onInitialize() is called after all mods are initialized
        // Use this to register things that need to be registered after all mods
        // are initialized, such as commands, dimensions, etc.

        // Example: Register block flammability
        //flammability.register(EXAMPLE_BLOCK.get(), 5, 20);

        // Example: Register block as furnace fuel
        // FuelRegistry.INSTANCE.add(EXAMPLE_BLOCK_ITEM.get(), 300);

        // Example: Register block for composting
        // CompostingChanceRegistry.INSTANCE.add(EXAMPLE_BLOCK_ITEM.get(), 1.0f);

        // Example: Register entity attributes
        // FabricDefaultAttributeRegistry.register(EXAMPLE_ANIMAL.get(), BreedableEntity.createCowAttributes());

        // Example: Add sleeping chance for mob
        // SleepingChanceRegistry.register(EXAMPLE_ANIMAL.get(), 0.0f);

        // Example: Villager professions
        // VillagerRegistry.register(new Identifier(MOD_ID, "example_villager"));
    }
}
