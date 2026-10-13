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
import com.mumfrey.liteloader.client.ducks.IFramebuffer;

import net.minecraft.client.shader.Framebuffer;

@Mixin(Framebuffer.class)
public abstract class MixinFramebuffer implements IFramebuffer
{
    private LiteLoaderEventBrokerClient broker;
    
    private boolean dispatchRenderEvent;
    
    @Override
    public IFramebuffer setDispatchRenderEvent(boolean dispatchRenderEvent)
    {
        this.dispatchRenderEvent = dispatchRenderEvent;
        return this;
    }
    
    @Override
    public boolean isDispatchRenderEvent()
    {
        return this.dispatchRenderEvent;
    }
    
    @Inject(method = "framebufferRenderExt(IIZ)V", at = @At(
        value = "INVOKE",
        target = "Lnet/minecraft/client/shader/Framebuffer;bindFramebufferTexture()V"
    ))
    private void onRenderFBO(int width, int height, boolean flag, CallbackInfo ci)
    {
        if (this.broker == null)
        {
            this.broker = LiteLoaderEventBrokerClient.getInstance();
        }
        
        if (this.dispatchRenderEvent && this.broker != null)
        {
            this.broker.onRenderFBO((Framebuffer)(Object)this, width, height);
        }
        this.dispatchRenderEvent = false;
    }
}
