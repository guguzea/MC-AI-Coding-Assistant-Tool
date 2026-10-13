/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.mixin;

import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

import com.mojang.realmsclient.RealmsMainScreen;
import com.mojang.realmsclient.dto.RealmsServer;
import com.mumfrey.liteloader.client.PacketEventsClient;

import net.minecraft.realms.RealmsScreen;

@Mixin(value = RealmsMainScreen.class, remap = false)
public abstract class MixinRealmsMainScreen extends RealmsScreen
{
    @Inject(
        method = "play(Lcom/mojang/realmsclient/dto/RealmsServer;Lnet/minecraft/realms/RealmsScreen;)V",
        at = @At("HEAD")
    )
    private void onJoinRealm(RealmsServer server, RealmsScreen screen, CallbackInfo ci)
    {
        PacketEventsClient.onJoinRealm(server);
    }
}
