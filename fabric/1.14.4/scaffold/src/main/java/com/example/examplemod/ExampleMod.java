package com.example.examplemod;

import net.fabricmc.api.ModInitializer;
import net.minecraft.block.Block;
import net.minecraft.block.Blocks;
import net.minecraft.block.material.Material;
import net.minecraft.item.BlockItem;
import net.minecraft.item.Item;
import net.minecraft.item.ItemGroup;
import net.minecraft.util.Identifier;
import net.minecraft.util.registry.Registry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ExampleMod implements ModInitializer {
    public static final String MOD_ID = "examplemod";
    public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);

    // === 方块 ===
    // 基础方块
    public static final Block MY_BLOCK = Registry.register(
        Registry.BLOCK,
        new Identifier(MOD_ID, "my_block"),
        new Block(Block.Properties.create(Material.STONE).hardnessAndResistance(1.5f))
    );

    // 同名 BlockItem
    public static final Item MY_BLOCK_ITEM = Registry.register(
        Registry.ITEM,
        new Identifier(MOD_ID, "my_block"),
        new BlockItem(MY_BLOCK, new Item.Properties().group(ItemGroup.BUILDING_BLOCKS))
    );

    // 无碰撞方块（植物）
    public static final Block MY_PLANT = Registry.register(
        Registry.BLOCK,
        new Identifier(MOD_ID, "my_plant"),
        new Block(Block.Properties.create(Material.PLANTS).noCollision().hardnessAndResistance(0))
    );

    // === 物品 ===
    public static final Item MY_ITEM = Registry.register(
        Registry.ITEM,
        new Identifier(MOD_ID, "my_item"),
        new Item(new Item.Properties().maxStackSize(64))
    );

    // 食物
    public static final Item MY_APPLE = Registry.register(
        Registry.ITEM,
        new Identifier(MOD_ID, "my_apple"),
        new Item(new Item.Properties()
            .group(ItemGroup.FOOD)
            .food(new FoodComponent.Builder()
                .hunger(4)
                .saturationModifier(1.2f)
                .alwaysEat()
                .build())
            .maxStackSize(64))
    );

    @Override
    public void onInitialize() {
        LOGGER.info("ExampleMod initialized for Minecraft 1.14.4");

        LOGGER.info("Registered {} blocks, {} items",
            2, 3);
    }
}
