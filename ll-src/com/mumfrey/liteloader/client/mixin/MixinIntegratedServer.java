/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.mixin;

import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.Surrogate;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

import com.mojang.authlib.GameProfileRepository;
import com.mojang.authlib.minecraft.MinecraftSessionService;
import com.mojang.authlib.yggdrasil.YggdrasilAuthenticationService;
import com.mumfrey.liteloader.client.LiteLoaderEventBrokerClient;

import net.minecraft.client.Minecraft;
import net.minecraft.server.MinecraftServer;
import net.minecraft.server.integrated.IntegratedServer;
import net.minecraft.server.management.PlayerProfileCache;
import net.minecraft.world.WorldSettings;

@Mixin(IntegratedServer.class)
public abstract class MixinIntegratedServer extends MinecraftServer
{
    private LiteLoaderEventBrokerClient broker = LiteLoaderEventBrokerClient.getInstance();
    
    public MixinIntegratedServer()
    {
        super(null, null, null, null, null, null, null);
    }
    
    @Inject(
        method = "<init>*", //(Lnet/minecraft/client/Minecraft;Ljava/lang/String;Ljava/lang/String;Lnet/minecraft/world/WorldSettings;)V",
        at = @At("RETURN"),
        remap = false
    )
    private void onConstructed(Minecraft mcIn, String folderName, String worldName, WorldSettings settings, YggdrasilAuthenticationService authSrv,
            MinecraftSessionService sessionSrv, GameProfileRepository profileRepo, PlayerProfileCache profileCache, CallbackInfo ci)
    {
        this.broker.onStartServer(this, folderName, worldName, settings);
    }

    @Surrogate
    private void onConstructed(Minecraft mcIn, CallbackInfo ci)
    {
//        ClientProxy.onCreateIntegratedServer((IntegratedServer)(Object)this, folderName, worldName, settings);
    }
}
