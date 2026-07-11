package com.example.examplemod;

import net.fabricmc.api.ClientModInitializer;
import net.fabricmc.fabric.api.blockrenderlayer.v1.BlockRenderLayerMap;
import net.fabricmc.fabric.api.client.command.v2.ClientCommandManager;
import net.fabricmc.fabric.api.client.command.v2.ClientCommandRegistrationCallback;
import net.fabricmc.fabric.api.client.event.lifecycle.v1.ClientTickEvents;
import net.fabricmc.fabric.api.client.keybinding.v1.KeyBindingConstants;
import net.fabricmc.fabric.api.client.keybinding.v1.KeyBindingRegistry;
import net.fabricmc.fabric.api.client.model.BakedModelManager;
import net.fabricmc.fabric.api.client.model.ModelLoadingRegistry;
import net.fabricmc.fabric.api.client.particle.v1.ParticleFactoryRegistry;
import net.fabricmc.fabric.api.client.particle.v1.SimpleParticleProvider;
import net.fabricmc.fabric.api.client.rendering.v1.BlockEntityRendererRegistry;
import net.fabricmc.fabric.api.client.rendering.v1.EntityRendererRegistry;
import net.fabricmc.fabric.api.client.rendering.v1.HudRenderCallback;
import net.fabricmc.fabric.api.client.screenhandler.v1.ScreenRegistry;
import net.fabricmc.fabric.api.client.sound.v1.MovingSoundInstanceSoundInstanceCallback;
import net.fabricmc.fabric.api.client.sound.v1.SoundEvents;
import net.minecraft.block.Blocks;
import net.minecraft.client.MinecraftClient;
import net.minecraft.client.option.KeyBinding;
import net.minecraft.client.render.RenderLayer;
import net.minecraft.client.render.block.entity.BlockEntityRenderer;
import net.minecraft.client.render.entity.EntityRenderer;
import net.minecraft.client.render.entity.EntityRendererProvider;
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
    public static final Identifier EXAMPLE_SOUND = new Identifier(MOD_ID, "example_sound");
    public static final Identifier EXAMPLE_PARTICLE = new Identifier(MOD_ID, "example_particle");

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

        // Example: Register particle
        // ParticleFactoryRegistry.INSTANCE.register(EXAMPLE_PARTICLE, SimpleParticleProvider(SpriteSet, Sprite));

        // Example: Register custom model loader
        // ModelLoadingRegistry.INSTANCE.registerModelProvider((manager, out) -> {
        //         out.accept(new Identifier(MOD_ID, "model/example_model.obj"));
        // });

        // Example: Register custom BakedModel handler
        // MinecraftClient.getInstance().getBakedModelManager().registerModelProperty();

        // Example: Keybinding
        // KeyBindingRegistry.INSTANCE.registerKeyBinding(EXAMPLE_KEY);
        // ClientTickEvents.END_CLIENT_TICK.register(client -> {
        //         while (EXAMPLE_KEY.wasPressed()) {
        //                 // Do something
        //         }
        // });

        // Example: Block render layer (for transparent/translucent blocks)
        // BlockRenderLayerMap.INSTANCE.putBlock(EXAMPLE_BLOCK.get(), RenderLayer.getTranslucent());

        // Example: Screen handler
        // ScreenRegistry.register(ExampleMod.EXAMPLE_SCREEN_HANDLER, (window, inventory, title) -> {
        //         return new ExampleScreen(window, inventory, title);
        // });

        // Example: Sound
        // SoundEvents.register(EXAMPLE_SOUND, new SoundEvent(EXAMPLE_SOUND));
        // MovingSoundInstanceSoundInstanceCallback callback = (sound, listener, distance) -> {...};
        // MovingSoundInstanceSoundInstanceCallback.register(EXAMPLE_SOUND, callback);

        // Example: HUD Render callback
        // HudRenderCallback.EVENT.register((drawContext, tickDelta) -> {
        //         // Render HUD elements
        // });
    }
}
