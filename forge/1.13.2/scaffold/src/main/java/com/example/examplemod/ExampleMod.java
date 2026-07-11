package com.example.examplemod;

import net.minecraft.block.Block;
import net.minecraft.block.material.Material;
import net.minecraft.item.Item;
import net.minecraft.item.ItemBlock;
import net.minecraft.item.ItemGroup;
import net.minecraft.util.ResourceLocation;
import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.event.RegistryEvent;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.event.lifecycle.FMLClientSetupEvent;
import net.minecraftforge.fml.event.lifecycle.FMLCommonSetupEvent;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@Mod(ExampleMod.MOD_ID)
public class ExampleMod {
    public static final String MOD_ID = "examplemod";
    private static final Logger LOGGER = LogManager.getLogger();

    // ---- 注册方块 ----
    public static final Block EXAMPLE_BLOCK = new Block(Block.Properties.create(Material.STONE)
            .hardnessAndResistance(1.5f, 6.0f));

    // ---- 注册物品 ----
    public static final Item EXAMPLE_ITEM = new Item(new Item.Properties()
            .group(ItemGroup.TAB_MISC)
            .maxStackSize(64));

    // ---- 注册方块物品 ----
    public static final Item EXAMPLE_BLOCK_ITEM = new ItemBlock(EXAMPLE_BLOCK,
            new Item.Properties().group(ItemGroup.TAB_BUILDING_BLOCKS));

    public ExampleMod() {
        LOGGER.info("ExampleMod constructor");
        FMLJavaModLoadingContext.get().getModEventBus().addListener(this::commonSetup);
        FMLJavaModLoadingContext.get().getModEventBus().addListener(this::clientSetup);
        MinecraftForge.EVENT_BUS.register(this);
    }

    private void commonSetup(final FMLCommonSetupEvent event) {
        LOGGER.info("ExampleMod commonSetup — mod loaded");
    }

    private void clientSetup(final FMLClientSetupEvent event) {
        LOGGER.info("Client setup");
    }

    // ---- 注册事件 ----
    @SubscribeEvent
    public void onBlocksRegistry(final RegistryEvent.Register<Block> event) {
        event.getRegistry().register(EXAMPLE_BLOCK.setRegistryName(new ResourceLocation(MOD_ID, "example_block")));
    }

    @SubscribeEvent
    public void onItemsRegistry(final RegistryEvent.Register<Item> event) {
        event.getRegistry().register(EXAMPLE_ITEM.setRegistryName(new ResourceLocation(MOD_ID, "example_item")));
        event.getRegistry().register(EXAMPLE_BLOCK_ITEM.setRegistryName(new ResourceLocation(MOD_ID, "example_block")));
    }
}
