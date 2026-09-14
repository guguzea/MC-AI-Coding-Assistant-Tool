package com.example.examplemod.mixin;

import net.minecraft.server.MinecraftServer;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

// 本文件补齐 examplemod.mixins.json 的 "mixins": ["ExampleMixin"] 声明
// （改前该声明指向不存在的类：本档原先只有 mixin/client/ExampleMixin.java）。
// 注入目标 net.minecraft/server/MinecraftServer#tick 存在性证据：
//   M:/data/fabric_1.17.1/mappings/yarn-1.17.1+build.65-tiny.gz
//   METHOD net/minecraft/server/MinecraftServer.tick (Ljava/util/function/BooleanSupplier;)V
@Mixin(MinecraftServer.class)
public class ExampleMixin {
    @Inject(at = @At("HEAD"), method = "tick")
    private void onTick(CallbackInfo ci) {
        // 在服务端 tick 时执行
    }
}
