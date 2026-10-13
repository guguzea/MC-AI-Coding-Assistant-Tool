/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.common.mixin;

import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

import com.mumfrey.liteloader.core.LiteLoaderEventBroker;

import net.minecraft.server.MinecraftServer;

@Mixin(MinecraftServer.class)
public abstract class MixinMinecraftServer
{
    LiteLoaderEventBroker<?, ?> broker = LiteLoaderEventBroker.getCommonBroker();
    
    @Inject(method = "updateTimeLightAndEntities()V", at = @At("HEAD"))
    private void onServerTick(CallbackInfo ci)
    {
        this.broker.onServerTick((MinecraftServer)(Object)this);
    }
}
