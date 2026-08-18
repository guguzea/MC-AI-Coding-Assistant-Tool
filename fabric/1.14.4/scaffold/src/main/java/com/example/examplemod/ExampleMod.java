package com.example.examplemod;

import net.fabricmc.api.ModInitializer;
import net.fabricmc.fabric.api.block.FabricBlockSettings;
import net.minecraft.block.Block;
import net.minecraft.block.material.Material;
import net.minecraft.item.BlockItem;
import net.minecraft.item.FoodComponent;
import net.minecraft.item.Item;
import net.minecraft.item.ItemGroup;
import net.minecraft.util.Identifier;
import net.minecraft.util.registry.Registry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ExampleMod implements ModInitializer {
    public static final String MOD_ID = "examplemod";
    public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);

    public static final Block MY_BLOCK = Registry.register(
        Registry.BLOCK,
        new Identifier(MOD_ID, "my_block"),
        new Block(FabricBlockSettings.of(Material.STONE).hardness(1.5f).resistance(6.0f))
    );

    public static final Item MY_BLOCK_ITEM = Registry.register(
        Registry.ITEM,
        new Identifier(MOD_ID, "my_block"),
        new BlockItem(MY_BLOCK, new Item.Settings().group(ItemGroup.BUILDING_BLOCKS))
    );

    public static final Block MY_PLANT = Registry.register(
        Registry.BLOCK,
        new Identifier(MOD_ID, "my_plant"),
        new Block(FabricBlockSettings.of(Material.PLANTS).noCollision().breakInstantly())
    );

    public static final Item MY_ITEM = Registry.register(
        Registry.ITEM,
        new Identifier(MOD_ID, "my_item"),
        new Item(new Item.Settings().maxCount(64))
    );

    public static final Item MY_APPLE = Registry.register(
        Registry.ITEM,
        new Identifier(MOD_ID, "my_apple"),
        new Item(new Item.Settings()
            .group(ItemGroup.FOOD)
            .food(new FoodComponent.Builder()
                .hunger(4)
                .saturationModifier(1.2f)
                .alwaysEdible()
                .build())
            .maxCount(64))
    );

    @Override
    public void onInitialize() {
        LOGGER.info("ExampleMod initialized for Minecraft 1.14.4");
    }
}
