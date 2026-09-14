package com.example.examplemod.mixin;

import net.minecraft.server.MinecraftServer;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

// 本文件补齐 examplemod.mixins.json 的 "mixins": ["ExampleMixin"] 声明
// （改前本档 src 下没有任何 mixin 目录，mixins.json 的 client 与 mixins 两条声明同时悬空）。
// 注入目标存在性证据：
//   M:/data/fabric_1.18.2/mappings/yarn-1.18.2+build.4-tiny.gz
//   METHOD net/minecraft/server/MinecraftServer.tick (Ljava/util/function/BooleanSupplier;)V
@Mixin(MinecraftServer.class)
public class ExampleMixin {
    @Inject(at = @At("HEAD"), method = "tick")
    private void onTick(CallbackInfo ci) {
        // 在服务端 tick 时执行
    }
}
