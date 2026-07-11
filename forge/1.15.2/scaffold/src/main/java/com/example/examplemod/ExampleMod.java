package com.example.examplemod;

import net.minecraft.item.BlockItem;
import net.minecraft.item.Item;
import net.minecraft.item.ItemGroup;
import net.minecraft.item.ItemStack;
import net.minecraft.item.crafting.IRecipeSerializer;
import net.minecraft.util.ResourceLocation;
import net.minecraftforge.api.distmarker.Dist;
import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.event.RegistryEvent;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.event.lifecycle.FMLClientSetupEvent;
import net.minecraftforge.fml.event.lifecycle.FMLCommonSetupEvent;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.IForgeRegistry;
import net.minecraftforge.registries.RegistryObject;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.google.common.collect.Maps;

import java.util.Map;
import java.util.function.Supplier;

@Mod(ExampleMod.MOD_ID)
public class ExampleMod {
    public static final String MOD_ID = "examplemod";
    private static final Logger LOGGER = LogManager.getLogger();

    // DeferredRegister — 持有某类对象的延迟注册器
    public static final DeferredRegister<Block> BLOCKS =
        DeferredRegister.create(ForgeRegistries.BLOCKS, MOD_ID);
    public static final DeferredRegister<Item> ITEMS =
        DeferredRegister.create(ForgeRegistries.ITEMS, MOD_ID);

    // ---- 注册方块 ----
    public static final RegistryObject<Block> EXAMPLE_BLOCK = BLOCKS.register("example_block",
        () -> new Block(Block.Properties.create(net.minecraft.block.material.Material.STONE)
            .hardnessAndResistance(1.5f, 6.0f)
            .harvestTool(net.minecraftforge.common.ToolType.PICKAXE)
            .harvestLevel(0)
        )
    );

    // ---- 注册方块对应的 ItemBlock ----
    public static final RegistryObject<Item> EXAMPLE_BLOCK_ITEM = ITEMS.register("example_block",
        () -> new BlockItem(EXAMPLE_BLOCK.get(), new Item.Properties()
            .group(ItemGroup.BUILDING_BLOCKS)
        )
    );

    // ---- 注册普通物品 ----
    public static final RegistryObject<Item> EXAMPLE_ITEM = ITEMS.register("example_item",
        () -> new Item(new Item.Properties()
            .group(ItemGroup.MISC)
            .maxStackSize(64)
        )
    );

    // ---- 注册食物（带药水效果）----
    public static final RegistryObject<Item> EXAMPLE_FOOD = ITEMS.register("example_food",
        () -> new Item(new Item.Properties()
            .group(ItemGroup.FOOD)
            .food(new Food.Builder()
                .hunger(4)
                .saturation(0.3f)
                .effect(() -> new net.minecraft.potion.EffectInstance(
                    net.minecraft.potion.Effects.JUMP_BOOST, 200, 1), 1.0f)
                .build())
        )
    );

    public ExampleMod() {
        IEventBus modEventBus = FMLJavaModLoadingContext.get().getModEventBus();

        // 将 DeferredRegister 注册到 modEventBus
        BLOCKS.register(modEventBus);
        ITEMS.register(modEventBus);

        // FMLCommonSetupEvent 在所有 mod constructor 执行完毕后触发
        modEventBus.addListener(this::commonSetup);

        // 注册服务端事件监听器
        MinecraftForge.EVENT_BUS.register(this);
    }

    private void commonSetup(final FMLCommonSetupEvent event) {
        LOGGER.info("ExampleMod commonSetup — mod loaded");
    }

    // ---- 服务端事件 ----
    @SubscribeEvent
    public void onServerStarting(net.minecraftforge.event.server.ServerStartingEvent event) {
        LOGGER.info("Server starting: {}", event.getServer().getFolderName());
    }

    // ---- 客户端事件 ----
    @Mod.EventBusSubscriber(modid = MOD_ID, bus = net.minecraftforge.eventbus.api.Bus.MOD, value = Dist.CLIENT)
    public static class ClientModEvents {
        @SubscribeEvent
        public static void onClientSetup(FMLClientSetupEvent event) {
            LOGGER.info("Client setup — game dir: {}", event.getMinecraftSupplier().get().gameDirectory);
        }
    }

    // Inner class for Items to help with deferred registration
    public static class Items {
        public static final DeferredRegister<Item> ITEMS = ExampleMod.ITEMS;
    }

    // Inner class for Blocks to help with deferred registration
    public static class Blocks {
        public static final DeferredRegister<Block> BLOCKS = ExampleMod.BLOCKS;
    }
}
