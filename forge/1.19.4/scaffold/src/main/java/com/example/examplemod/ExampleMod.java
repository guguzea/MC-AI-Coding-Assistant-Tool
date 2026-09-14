package com.example.examplemod;

import com.mojang.logging.LogUtils;
import net.minecraft.client.Minecraft;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.food.FoodProperties;
import net.minecraft.world.item.BlockItem;
import net.minecraft.world.item.CreativeModeTabs;
import net.minecraft.world.item.Item;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.minecraft.world.level.material.Material;
import net.minecraft.world.level.material.MaterialColor;
import net.minecraftforge.api.distmarker.Dist;
import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.event.CreativeModeTabEvent;
import net.minecraftforge.event.server.ServerStartingEvent;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.event.lifecycle.FMLClientSetupEvent;
import net.minecraftforge.fml.event.lifecycle.FMLCommonSetupEvent;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;
import org.slf4j.Logger;

@Mod(ExampleMod.MOD_ID)
public class ExampleMod {
    public static final String MOD_ID = "examplemod";
    private static final Logger LOGGER = LogUtils.getLogger();

    // DeferredRegister — 持有某类对象的延迟注册器
    // 所有注册通过 modEventBus 延迟到正确的 RegisterEvent 时机执行（RegisterEvent 只派发于 Mod 总线）
    // 泛型参数可选，但显式写明可提升 IDE 代码补全体验
    public static final DeferredRegister<Block> BLOCKS =
        DeferredRegister.create(ForgeRegistries.BLOCKS, MOD_ID);
    public static final DeferredRegister<Item> ITEMS =
        DeferredRegister.create(ForgeRegistries.ITEMS, MOD_ID);

    // ---- 注册方块 ----
    public static final RegistryObject<Block> EXAMPLE_BLOCK = BLOCKS.register("example_block",
        () -> new Block(BlockBehaviour.Properties.of(Material.STONE, MaterialColor.STONE)
            .strength(1.5f, 6.0f)
            .requiresCorrectToolForDrops()
        )
    );

    // ---- 注册方块对应的 ItemBlock ----
    // ItemBlock 与方块使用相同 registry name，自动关联
    public static final RegistryObject<Item> EXAMPLE_BLOCK_ITEM = ITEMS.register("example_block",
        () -> new BlockItem(EXAMPLE_BLOCK.get(), new Item.Properties())
    );

    // ---- 注册普通物品 ----
    public static final RegistryObject<Item> EXAMPLE_ITEM = ITEMS.register("example_item",
        () -> new Item(new Item.Properties()
            .stacksTo(64)
        )
    );

    // ---- 注册食物（带药水效果） ----
    public static final RegistryObject<Item> EXAMPLE_FOOD = ITEMS.register("example_food",
        () -> new Item(new Item.Properties()
            .food(new FoodProperties.Builder()
                .nutrition(4)
                .saturationMod(0.3f)
                .effect(() -> new net.minecraft.world.effect.MobEffectInstance(
                    net.minecraft.world.effect.MobEffects.JUMP, 200, 1), 1.0f)
                .build())
        )
    );

    // ---- 自定义创造模式标签 ----
    // 1.19.4 期标签还不是 registry 对象（该版 Registries 里没有 CREATIVE_MODE_TAB），
    // 不能在字段初始化处 new 出来，只能在 mod 总线的 CreativeModeTabEvent.Register 里注册，见下方 registerTabs。

    public ExampleMod(FMLJavaModLoadingContext context) {
        IEventBus modEventBus = context.getModEventBus();

        // 将 DeferredRegister 注册到 modEventBus
        // DeferredRegister 内部会在正确的 RegisterEvent 时机执行注册逻辑
        BLOCKS.register(modEventBus);
        ITEMS.register(modEventBus);

        // FMLCommonSetupEvent 在所有 mod constructor 执行完毕后触发
        modEventBus.addListener(this::commonSetup);

        // 注册服务端事件监听器
        MinecraftForge.EVENT_BUS.register(this);

        // 创造模式标签：注册与填内容都在 mod 总线（CreativeModeTabEvent 实现 IModBusEvent）
        modEventBus.addListener(this::registerTabs);
        modEventBus.addListener(this::addCreative);
    }

    private void commonSetup(final FMLCommonSetupEvent event) {
        LOGGER.info("ExampleMod commonSetup — mod loaded");
    }

    // ---- 注册自定义创造模式标签（1.19.4 走事件，不走 DeferredRegister） ----
    private void registerTabs(CreativeModeTabEvent.Register event) {
        event.registerCreativeModeTab(
            new ResourceLocation(MOD_ID, "example_tab"),
            builder -> builder
                .title(Component.translatable("itemGroup." + MOD_ID))
                .icon(() -> EXAMPLE_ITEM.get().getDefaultInstance())
                .displayItems((parameters, output) -> {
                    output.accept(EXAMPLE_ITEM.get());
                    output.accept(EXAMPLE_FOOD.get());
                })
        );
    }

    // ---- 将物品添加到原版创造模式标签（同一事件总线的 BuildContents） ----
    private void addCreative(CreativeModeTabEvent.BuildContents event) {
        if (event.getTab() == CreativeModeTabs.INGREDIENTS) {
            event.accept(EXAMPLE_ITEM);
        }
    }

    // ---- 服务端事件 ----
    @SubscribeEvent
    public void onServerStarting(ServerStartingEvent event) {
        LOGGER.info("Server starting: {}", event.getServer().getWorldData().getLevelName());
    }

    // ---- 客户端事件 ----
    @Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)
    public static class ClientModEvents {
        @SubscribeEvent
        public static void onClientSetup(FMLClientSetupEvent event) {
            LOGGER.info("Client setup — game dir: {}", Minecraft.getInstance().gameDirectory);
        }
    }

}
