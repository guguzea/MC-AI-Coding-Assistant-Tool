/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.mixin;

import java.util.Map;

import org.spongepowered.asm.mixin.Final;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Shadow;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Redirect;

import com.mumfrey.liteloader.client.LiteLoaderEventBrokerClient;
import com.mumfrey.liteloader.client.ducks.IRenderManager;

import net.minecraft.client.renderer.entity.Render;
import net.minecraft.client.renderer.entity.RenderManager;
import net.minecraft.entity.Entity;

@Mixin(RenderManager.class)
public abstract class MixinRenderManager implements IRenderManager
{
    @Shadow @Final private Map<Class<? extends Entity>, Render<? extends Entity>> entityRenderMap;
    
    private LiteLoaderEventBrokerClient broker;
    
    @Override
    public Map<Class<? extends Entity>, Render<? extends Entity>> getRenderMap()
    {
        return this.entityRenderMap;
    }
    
    @Redirect(method = "renderEntity(Lnet/minecraft/entity/Entity;DDDFFZ)V", at = @At(
        value = "INVOKE",
        target = "Lnet/minecraft/client/renderer/entity/Render;doRender(Lnet/minecraft/entity/Entity;DDDFF)V"
    ))
    private <T extends Entity> void onRenderEntity(Render<T> render, T entity, double x, double y, double z, float entityYaw, float partialTicks)
    {
        if (this.broker == null)
        {
            this.broker = LiteLoaderEventBrokerClient.getInstance();
        }

        this.broker.onRenderEntity((RenderManager)(Object)this, entity, x, y, z, entityYaw, partialTicks, render);
        render.func_76986_a(entity, x, y, z, entityYaw, partialTicks);
        this.broker.onPostRenderEntity((RenderManager)(Object)this, entity, x, y, z, entityYaw, partialTicks, render);
    }
}
