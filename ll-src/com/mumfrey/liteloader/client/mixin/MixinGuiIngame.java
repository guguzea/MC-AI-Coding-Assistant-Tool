/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.mixin;

import org.spongepowered.asm.mixin.Final;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Shadow;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.At.Shift;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

import com.mumfrey.liteloader.client.LiteLoaderEventBrokerClient;

import net.minecraft.client.gui.Gui;
import net.minecraft.client.gui.GuiIngame;
import net.minecraft.client.gui.GuiNewChat;

@Mixin(GuiIngame.class)
public abstract class MixinGuiIngame extends Gui
{
    @Shadow @Final private GuiNewChat persistantChatGUI;
    
    private LiteLoaderEventBrokerClient broker = LiteLoaderEventBrokerClient.getInstance();
    
    @Inject(method = "renderGameOverlay(F)V", at = @At(
        value = "INVOKE",
        target = "Lnet/minecraft/client/gui/GuiNewChat;drawChat(I)V"
    ))
    private void onRenderChat(float partialTicks, CallbackInfo ci)
    {
        this.broker.onRenderChat(this.persistantChatGUI, partialTicks);
    }

    @Inject(method = "renderGameOverlay(F)V", at = @At(
        value = "INVOKE",
        shift = Shift.AFTER,
        target = "Lnet/minecraft/client/gui/GuiNewChat;drawChat(I)V"
    ))
    private void postRenderChat(float partialTicks, CallbackInfo ci)
    {
        this.broker.postRenderChat(this.persistantChatGUI, partialTicks);
    }
}
