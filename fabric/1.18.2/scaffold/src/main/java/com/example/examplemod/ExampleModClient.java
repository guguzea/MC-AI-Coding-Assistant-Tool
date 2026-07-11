package com.example.examplemod;

import net.fabricmc.api.ClientModInitializer;
import net.fabricmc.api.EnvType;
import net.fabricmc.api.Environment;
import net.fabricmc.fabric.api.client.rendering.v1.EntityRendererRegistry;
import net.minecraft.client.render.entity.EntityRenderer;
import net.minecraft.client.render.entity.EntityRendererRegistry;
import net.minecraft.client.render.entity.model.CowEntityModel;
import net.minecraft.client.render.entity.model.EntityModelLayer;
import net.minecraft.client.render.entity.model.CowModel;
import net.minecraft.client.render.entity.renderer.AnimalsRenderer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Environment(EnvType.CLIENT)
public class ExampleModClient implements ClientModInitializer {
    public static final String MOD_ID = "examplemod";
    public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);

    @Override
    public void onInitializeClient() {
        LOGGER.info("ExampleMod client initialized");

        // 注册实体渲染器（1.18.x 使用 EntityRendererRegistry.Context）
        EntityRendererRegistry.register(ExampleMod.EXAMPLE_ANIMAL.get(), (context) ->
            new AnimalsRenderer<>(context, new CowEntityModel(context.getModelLoader().getModelPart(getCowModelLayer())), 0.5f)
        );
    }

    // 1.18.x uses EntityModelLayer for model registration
    private static EntityModelLayer getCowModelLayer() {
        return new EntityModelLayer(new net.minecraft.util.Identifier("main", "cow"), "cow");
    }
}
