package com.example.examplemod.mixin.client;

import net.minecraft.client.MinecraftClient;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

// 本文件补齐 examplemod.mixins.json 的 "client": ["client.ExampleMixin"] 声明。
// 注入目标存在性证据：
//   M:/data/fabric_1.18.2/mappings/yarn-1.18.2+build.4-tiny.gz
//   METHOD net/minecraft/client/MinecraftClient.tick ()V
@Mixin(MinecraftClient.class)
public class ExampleMixin {
    @Inject(at = @At("HEAD"), method = "tick")
    private void onTick(CallbackInfo ci) {
        // 在客户端 tick 时执行
    }
}
