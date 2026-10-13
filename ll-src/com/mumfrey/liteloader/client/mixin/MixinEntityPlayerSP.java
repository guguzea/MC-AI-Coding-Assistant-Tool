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

import com.mumfrey.liteloader.client.LiteLoaderEventBrokerClient;

import net.minecraft.client.entity.AbstractClientPlayer;
import net.minecraft.client.entity.EntityPlayerSP;

@Mixin(EntityPlayerSP.class)
public abstract class MixinEntityPlayerSP extends AbstractClientPlayer
{
    public MixinEntityPlayerSP()
    {
        super(null, null);
    }
    
    @Inject(method = "sendChatMessage(Ljava/lang/String;)V", at = { @At("HEAD") }, cancellable = true)
    public void onSendChatMessage(String message, CallbackInfo ci)
    {
        LiteLoaderEventBrokerClient.getInstance().onSendChatMessage(ci, message);
    }
}
