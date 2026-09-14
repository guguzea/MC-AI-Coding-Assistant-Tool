package com.example.examplemod;

import net.fabricmc.api.ClientModInitializer;
import net.fabricmc.fabric.api.blockrenderlayer.v1.BlockRenderLayerMap;
import net.fabricmc.fabric.api.client.command.v2.ClientCommandManager;
import net.fabricmc.fabric.api.client.command.v2.ClientCommandRegistrationCallback;
import net.fabricmc.fabric.api.client.event.lifecycle.v1.ClientTickEvents;
import net.fabricmc.fabric.api.client.keybinding.v1.KeyBindingHelper;
import net.fabricmc.fabric.api.client.model.loading.v1.ModelLoadingPlugin;
import net.fabricmc.fabric.api.client.particle.v1.ParticleFactoryRegistry;
import net.fabricmc.fabric.api.client.rendering.v1.BlockEntityRendererRegistry;
import net.fabricmc.fabric.api.client.rendering.v1.EntityRendererRegistry;
import net.fabricmc.fabric.api.client.rendering.v1.HudRenderCallback;
import net.minecraft.block.Blocks;
import net.minecraft.client.MinecraftClient;
import net.minecraft.client.option.KeyBinding;
import net.minecraft.client.render.RenderLayer;
import net.minecraft.client.render.block.entity.BlockEntityRenderer;
import net.minecraft.client.render.entity.EntityRenderer;
import net.minecraft.client.render.entity.model.EntityModelLayer;
import net.minecraft.client.util.InputUtil;
import net.minecraft.entity.Entity;
import net.minecraft.entity.EntityType;
import net.minecraft.registry.Registries;
import net.minecraft.registry.Registry;
import net.minecraft.registry.RegistryKey;
import net.minecraft.screen.ScreenHandlerType;
import net.minecraft.sound.SoundEvent;
import net.minecraft.util.Identifier;
import net.minecraft.util.math.BlockPos;
import org.lwjgl.glfw.GLFW;

import java.util.Map;

public class ExampleModClient implements ClientModInitializer {
    public static final String MOD_ID = "examplemod";
    public static final Identifier EXAMPLE_SOUND = Identifier.of(MOD_ID, "example_sound");
    public static final Identifier EXAMPLE_PARTICLE = Identifier.of(MOD_ID, "example_particle");

    // Example keybinding
    // public static final KeyBinding EXAMPLE_KEY = new KeyBinding(
    //         "key.examplemod.example_key",
    //         InputUtil.Type.KEYSYM,
    //         GLFW.GLFW_KEY_V,
    //         "category.examplemod"
    // );

    @Override
    public void onInitializeClient() {
        // This entrypoint is executed on the client side only.
        // Register client-side only things here.

        // Example: Register block entity renderer
        // BlockEntityRendererRegistry.register(ExampleBlockEntity.class, ExampleBlockEntityRenderer::new);

        // Example: Register entity renderer
        // EntityRendererRegistry.register(ExampleMod.EXAMPLE_ANIMAL.get(), (context) -> {
        //         return new AnimalEntityRenderer<>(context.getModelLoader().getModelPart(EntityModelLayers.COW), 0.5f);
        // });

        // Example: Register particle（本版真实入口：ParticleFactoryRegistry.getInstance().register(ParticleType, ParticleFactory)）
        // ParticleFactoryRegistry.getInstance().register(EXAMPLE_PARTICLE_TYPE, MyParticle::new);

        // Example: Register custom model loader（本版真实入口：ModelLoadingPlugin.register(plugin)）
        // ModelLoadingPlugin.register(context -> {
        //         // TODO(未核实)：context 上的具体注册方法名本仓未取证（javap 只证到 register(...) 与 onInitializeModelLoader(Context) 这一层）
        // });

        // Example: Keybinding（本版真实入口是 KeyBindingHelper，不存在 KeyBindingRegistry / KeyBindingConstants）
        // KeyBindingHelper.registerKeyBinding(EXAMPLE_KEY);
        // ClientTickEvents.END_CLIENT_TICK.register(client -> {
        //         while (EXAMPLE_KEY.wasPressed()) {
        //                 // Do something
        //         }
        // });

        // Example: Block render layer (for transparent/translucent blocks)
        // BlockRenderLayerMap.INSTANCE.putBlock(EXAMPLE_BLOCK.get(), RenderLayer.getTranslucent());

        // Example: Screen handler / Sound —— 本版 Fabric API 无对应公开注册入口，别照抄：
        //   screen-handler 模块只暴露 net.fabricmc.fabric.api.screenhandler.v1 的
        //     ExtendedScreenHandlerFactory / ExtendedScreenHandlerType / FabricScreenHandlerFactory（没有 client.screenhandler.v1.ScreenRegistry）；
        //   sound 模块只有 net.fabricmc.fabric.api.client.sound.v1.FabricSoundInstance（没有 SoundEvents / MovingSoundInstance…Callback）。
        //   要写这两类功能须先按本仓纪律取证（query_loader_api / 自备 jar + ingest_loader_api），禁止凭记忆补。

        // Example: HUD Render callback
        // HudRenderCallback.EVENT.register((drawContext, tickDelta) -> {
        //         // Render HUD elements
        // });
    }
}
