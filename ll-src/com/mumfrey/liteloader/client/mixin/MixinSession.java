/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.mixin;

import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Shadow;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;

import com.mojang.authlib.GameProfile;

import net.minecraft.entity.player.EntityPlayer;
import net.minecraft.util.Session;

@Mixin(Session.class)
public abstract class MixinSession
{
    @Shadow public abstract String getUsername();

    @Inject(method = "getProfile()Lcom/mojang/authlib/GameProfile;", cancellable = true, at = @At(
        value = "NEW",
        target = "com/mojang/authlib/GameProfile",
        ordinal = 1,
        remap = false
    ))
    private void generateGameProfile(CallbackInfoReturnable<GameProfile> ci)
    {
        ci.setReturnValue(new GameProfile(EntityPlayer.func_175147_b(this.getUsername()), this.getUsername()));
    }
}
