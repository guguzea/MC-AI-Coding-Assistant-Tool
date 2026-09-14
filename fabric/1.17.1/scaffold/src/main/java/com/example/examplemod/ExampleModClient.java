package com.example.examplemod;

import net.fabricmc.api.ClientModInitializer;
import net.fabricmc.api.EnvType;
import net.fabricmc.api.Environment;
import net.fabricmc.fabric.api.client.rendering.v1.EntityRendererRegistry;
import net.minecraft.client.render.entity.CowEntityRenderer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Environment(EnvType.CLIENT)
public class ExampleModClient implements ClientModInitializer {
    public static final String MOD_ID = "examplemod";
    public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);

    @Override
    public void onInitializeClient() {
        LOGGER.info("ExampleMod client initialized");

        // 1.17.1 的注册类是 net.fabricmc.fabric.api.client.rendering.v1.EntityRendererRegistry
        // （public static void register(EntityType<? extends E>, EntityRendererFactory<E>)），
        // 渲染器类名在本档是 net.minecraft.client.render.entity.CowEntityRenderer
        // —— net.minecraft.client.render.entity.renderer 包在 1.17.1 不存在。
        // 注册需要 EntityType 字段，而 ExampleAnimalEntity 未在本档注册，ExampleMod 里没有可传的字段，
        // 故此处不写会编译失败的示例调用。
        // TODO(未核实)：补 ExampleMod 的 EntityType 注册后再在此挂渲染器。
    }
}
