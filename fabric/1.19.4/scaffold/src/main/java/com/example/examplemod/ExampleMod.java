package com.example.examplemod;

import net.fabricmc.api.ModInitializer;
import net.fabricmc.fabric.api.object.builder.v1.entity.FabricEntityTypeBuilder;
import net.fabricmc.fabric.api.registry.EntityAttributeRegistry;
import net.fabricmc.fabric.api.registry.RegistrySupplier;
import net.minecraft.block.Blocks;
import net.minecraft.block.FabricBlockSettings;
import net.minecraft.entity.EntityType;
import net.minecraft.entity.SpawnGroup;
import net.minecraft.entity.attribute.EntityAttributes;
import net.minecraft.entity.mob.MobEntity;
import net.minecraft.entity.passive.AnimalEntity;
import net.minecraft.item.BlockItem;
import net.minecraft.item.FoodComponent;
import net.minecraft.item.Item;
import net.minecraft.item.ItemGroup;
import net.minecraft.registry.Registries;
import net.minecraft.registry.Registry;
import net.minecraft.util.Identifier;
import net.minecraft.world.Heightmap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ExampleMod implements ModInitializer {
    public static final String MOD_ID = "examplemod";
    public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);

    // === 方块 ===
    // 基础方块
    public static final RegistrySupplier<Block> MY_BLOCK =
        Registry.register(
            Registries.BLOCK,
            new Identifier(MOD_ID, "my_block"),
            new Block(FabricBlockSettings.copyOf(Blocks.STONE).strength(1.5f))
        );

    // 同名 BlockItem
    public static final RegistrySupplier<Item> MY_BLOCK_ITEM =
        Registry.register(
            Registries.ITEM,
            new Identifier(MOD_ID, "my_block"),
            new BlockItem(MY_BLOCK.get(), new Item.Settings())
        );

    // 无碰撞方块（植物）
    public static final RegistrySupplier<Block> MY_PLANT =
        Registry.register(
            Registries.BLOCK,
            new Identifier(MOD_ID, "my_plant"),
            new Block(FabricBlockSettings.copyOf(Blocks.DANDELION).noCollision().breakInstantly())
        );

    // === 物品 ===
    public static final RegistrySupplier<Item> MY_ITEM =
        Registry.register(
            Registries.ITEM,
            new Identifier(MOD_ID, "my_item"),
            new Item(new Item.Settings().maxCount(64))
        );

    // 食物
    public static final RegistrySupplier<Item> MY_APPLE =
        Registry.register(
            Registries.ITEM,
            new Identifier(MOD_ID, "my_apple"),
            new Item(new Item.Settings()
                .food(new FoodComponent.Builder()
                    .hunger(4)
                    .saturationModifier(1.2f)
                    .alwaysEdible()
                    .build())
                .maxCount(64))
        );

    // === 实体 ===
    public static final RegistrySupplier<EntityType<ExampleAnimalEntity>> EXAMPLE_ANIMAL =
        Registry.register(
            Registries.ENTITY_TYPE,
            new Identifier(MOD_ID, "example_animal"),
            FabricEntityTypeBuilder.create(SpawnGroup.CREATURE, ExampleAnimalEntity::new)
                .dimensions(EntityType.EntityDimensions.fixed(0.9f, 1.4f))
                .maxTrackOffset(10)
                .trackRangeBlocks(10)
                .build()
        );

    @Override
    public void onInitialize() {
        LOGGER.info("ExampleMod initialized for Minecraft 1.19.4");

        // 注册实体属性
        EntityAttributeRegistry.register(EXAMPLE_ANIMAL,
            MobEntity.createMobAttributes()
                .add(EntityAttributes.GENERIC_MAX_HEALTH, 20.0)
                .add(EntityAttributes.GENERIC_MOVEMENT_SPEED, 0.25)
                .add(EntityAttributes.GENERIC_ATTACK_DAMAGE, 2.0)
        );

        // 设置生成限制
        SpawnRestriction.register(
            EXAMPLE_ANIMAL.get(),
            SpawnRestriction.Location.ON_GROUND,
            Heightmap.Type.MOTION_BLOCKING_NO_LEAVES,
            AnimalEntity::canSpawn
        );

        LOGGER.info("Registered {} blocks, {} items, {} entities",
            2, 3, 1);
    }
}
