/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.common.mixin;

import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.Surrogate;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;

import com.mojang.authlib.GameProfile;
import com.mumfrey.liteloader.core.LiteLoaderEventBroker;

import net.minecraft.entity.player.EntityPlayerMP;
import net.minecraft.network.NetHandlerPlayServer;
import net.minecraft.network.NetworkManager;
import net.minecraft.server.management.PlayerList;

@Mixin(value = PlayerList.class, priority = 2000)
public abstract class MixinPlayerList
{
    @Inject(
        method = "initializeConnectionToPlayer(Lnet/minecraft/network/NetworkManager;Lnet/minecraft/entity/player/EntityPlayerMP;)V",
        at = @At("RETURN")
    )
    private void onInitializePlayerConnection(NetworkManager netManager, EntityPlayerMP player, CallbackInfo ci)
    {
        LiteLoaderEventBroker.getCommonBroker().onInitializePlayerConnection((PlayerList)(Object)this, netManager, player);
    }

    // Because, forge
    @Surrogate
    private void onInitializePlayerConnection(NetworkManager netManager, EntityPlayerMP player, NetHandlerPlayServer nhps, CallbackInfo ci)
    {
        LiteLoaderEventBroker.getCommonBroker().onInitializePlayerConnection((PlayerList)(Object)this, netManager, player);
    }
    
    @Inject(method = "playerLoggedIn(Lnet/minecraft/entity/player/EntityPlayerMP;)V", at = @At("RETURN"))
    private void onPlayerLogin(EntityPlayerMP player, CallbackInfo ci)
    {
        LiteLoaderEventBroker.getCommonBroker().onPlayerLogin((PlayerList)(Object)this, player);
    }
    
    @Inject(method = "playerLoggedOut(Lnet/minecraft/entity/player/EntityPlayerMP;)V", at = @At("RETURN"))
    private void onPlayerLogout(EntityPlayerMP player, CallbackInfo ci)
    {
        LiteLoaderEventBroker.getCommonBroker().onPlayerLogout((PlayerList)(Object)this, player);
    }
    
    @Inject(
        method = "createPlayerForUser(Lcom/mojang/authlib/GameProfile;)Lnet/minecraft/entity/player/EntityPlayerMP;",
        cancellable = true,
        at = @At("RETURN")
    )
    private void onSpawnPlayer(GameProfile profile, CallbackInfoReturnable<EntityPlayerMP> cir)
    {
        LiteLoaderEventBroker.getCommonBroker().onSpawnPlayer((PlayerList)(Object)this, cir.getReturnValue(), profile);
    }
    
    @Inject(
        method = "recreatePlayerEntity(Lnet/minecraft/entity/player/EntityPlayerMP;IZ)Lnet/minecraft/entity/player/EntityPlayerMP;",
        cancellable = true,
        at = @At("RETURN")
    )
    private void onRespawnPlayer(EntityPlayerMP player, int dimension, boolean conqueredEnd, CallbackInfoReturnable<EntityPlayerMP> cir)
    {
        LiteLoaderEventBroker.getCommonBroker().onRespawnPlayer((PlayerList)(Object)this, cir.getReturnValue(), player, dimension, conqueredEnd);
    }
}
