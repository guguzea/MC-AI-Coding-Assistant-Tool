package com.example.examplemod;

import com.mojang.logging.LogUtils;
import net.minecraft.core.registries.Registries;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.food.FoodProperties;
import net.minecraft.world.item.BlockItem;
import net.minecraft.world.item.CreativeModeTab;
import net.minecraft.world.item.Item;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.minecraft.world.level.material.Material;
import net.minecraftforge.api.distmarker.Dist;
import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.event.RegistryEvent;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.event.lifecycle.FMLClientSetupEvent;
import net.minecraftforge.fml.event.lifecycle.FMLCommonSetupEvent;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;
import net.minecraftforge.registries.ObjectHolder;
import org.slf4j.Logger;

@Mod(ExampleMod.MOD_ID)
public class ExampleMod {
    public static final String MOD_ID = "examplemod";
    private static final Logger LOGGER = LogUtils.getLogger();

    // ---- ObjectHolder 示例：引用其他 mod 的物品/方块 ----
    @ObjectHolder("minecraft:diamond")
    public static Item DIAMOND;

    // ---- 注册方块 ----
    public static Block EXAMPLE_BLOCK;

    // ---- 注册方块对应的 ItemBlock ----
    public static BlockItem EXAMPLE_BLOCK_ITEM;

    // ---- 注册普通物品 ----
    public static Item EXAMPLE_ITEM;

    // ---- 注册食物（带药水效果）----
    public static Item EXAMPLE_FOOD;

    public ExampleMod() {
        IEventBus modEventBus = FMLJavaModLoadingContext.get().getModEventBus();
        modEventBus.addListener(this::commonSetup);

        // 注册服务端事件监听器
        MinecraftForge.EVENT_BUS.register(this);
    }

    private void commonSetup(final FMLCommonSetupEvent event) {
        LOGGER.info("ExampleMod commonSetup — mod loaded");
    }

    // ---- 方块注册 ----
    @SubscribeEvent
    public void registerBlocks(RegistryEvent.Register<Block> event) {
        EXAMPLE_BLOCK = new Block(BlockBehaviour.Properties.of(Material.STONE)
            .strength(1.5f, 6.0f);
        EXAMPLE_BLOCK.setRegistryName(new ResourceLocation(MOD_ID, "example_block"));
        event.getRegistry().register(EXAMPLE_BLOCK);
    }

    // ---- 物品注册 ----
    @SubscribeEvent
    public void registerItems(RegistryEvent.Register<Item> event) {
        // 方块物品
        EXAMPLE_BLOCK_ITEM = new BlockItem(EXAMPLE_BLOCK,
            new Item.Properties().tab(CreativeModeTab.TAB_BUILDING_BLOCKS));
        EXAMPLE_BLOCK_ITEM.setRegistryName(EXAMPLE_BLOCK.getRegistryName());
        event.getRegistry().register(EXAMPLE_BLOCK_ITEM);

        // 普通物品
        EXAMPLE_ITEM = new Item(new Item.Properties()
            .tab(CreativeModeTab.TAB_MISC)
            .stacksTo(64));
        EXAMPLE_ITEM.setRegistryName(new ResourceLocation(MOD_ID, "example_item"));
        event.getRegistry().register(EXAMPLE_ITEM);

        // 食物
        EXAMPLE_FOOD = new Item(new Item.Properties()
            .tab(CreativeModeTab.TAB_FOOD)
            .food(new FoodProperties.Builder()
                .nutrition(4)
                .saturationMod(0.3f)
                .effect(() -> new net.minecraft.world.effect.MobEffectInstance(
                    net.minecraft.world.effect.MobEffects.JUMP, 200, 1), 1.0f)
                .build())
        );
        EXAMPLE_FOOD.setRegistryName(new ResourceLocation(MOD_ID, "example_food"));
        event.getRegistry().register(EXAMPLE_FOOD);
    }

    // ---- 服务端事件 ----
    @SubscribeEvent
    public void onServerStarting(net.minecraftforge.event.server.ServerStartingEvent event) {
        LOGGER.info("Server starting: {}", event.getServer().getWorldData().getLevelName());
    }

    // ---- 客户端事件 ----
    @Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)
    public static class ClientModEvents {
        @SubscribeEvent
        public static void onClientSetup(FMLClientSetupEvent event) {
            LOGGER.info("Client setup — game dir: {}",
                net.minecraft.client.Minecraft.getInstance().gameDirectory);
        }
    }
}
