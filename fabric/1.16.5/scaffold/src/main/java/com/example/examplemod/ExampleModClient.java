package com.example.examplemod;

import net.fabricmc.api.ClientModInitializer;
import net.fabricmc.api.EnvType;
import net.fabricmc.api.Environment;
import net.minecraft.client.render.entity.model.CowEntityModel;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@Environment(EnvType.CLIENT)
public class ExampleModClient implements ClientModInitializer {
    public static final String MOD_ID = "examplemod";
    public static final Logger LOGGER = LogManager.getLogger(MOD_ID);

    @Override
    public void onInitializeClient() {
        LOGGER.info("ExampleMod client initialized");

        // 注册实体渲染器：1.16.5 的注册类是
        //   net.fabricmc.fabric.api.client.rendereregistry.v1.EntityRendererRegistry
        // （本档没有 1.17+ 才出现的 net.fabricmc.fabric.api.client.rendering.v1 包）
        // 该 API 在 1.16.5 是实例形态（register(EntityType<?>, EntityRendererRegistry.Factory)），
        // 且 ExampleAnimalEntity 未在本档注册为 EntityType，没有字段可传，
        // 故此处不写会编译失败的示例调用。
        // TODO(未核实)：静态入口字段名待该档 fabric-api jar 走 ingest_loader_api 入库后再补。
    }
}
