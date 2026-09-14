package com.example.examplemod;

import net.fabricmc.api.ClientModInitializer;
import net.fabricmc.api.EnvType;
import net.fabricmc.api.Environment;
import net.fabricmc.fabric.api.client.rendering.v1.EntityRendererRegistry;
import net.minecraft.client.render.entity.EntityRenderer;
import net.minecraft.client.render.entity.model.CowEntityModel;
import net.minecraft.client.render.entity.model.EntityModelLayer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Environment(EnvType.CLIENT)
public class ExampleModClient implements ClientModInitializer {
    public static final String MOD_ID = "examplemod";
    public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);

    @Override
    public void onInitializeClient() {
        LOGGER.info("ExampleMod client initialized");

        // 1.18.2 的注册类是 net.fabricmc.fabric.api.client.rendering.v1.EntityRendererRegistry
        // （public static void register(EntityType<? extends E>, EntityRendererFactory<E>)，
        //   证据 M:/mcp-server/data/loader-api-summaries/1.18.2-fabric-api.json:581）；
        // 本档牛模型类实名 net.minecraft.client.render.entity.model.CowEntityModel
        // （net...entity.model.CowModel 与 net...entity.renderer.AnimalsRenderer 在 1.18.2 都不存在），
        // 原版也没有 net.minecraft.client.render.entity.EntityRendererRegistry 这一类。
        // 注册需要 EntityType 字段，而 ExampleAnimalEntity 未在本档注册，ExampleMod 里没有可传的字段，
        // 故此处不写会编译失败的示例调用。
        // TODO(未核实)：补 ExampleMod 的 EntityType 注册后再在此挂渲染器。
    }

    // 1.18.x uses EntityModelLayer for model registration
    private static EntityModelLayer getCowModelLayer() {
        return new EntityModelLayer(new net.minecraft.util.Identifier("main", "cow"), "cow");
    }
}
