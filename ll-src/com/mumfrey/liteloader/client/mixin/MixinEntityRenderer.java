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
import com.mumfrey.liteloader.client.overlays.IEntityRenderer;

import net.minecraft.client.renderer.EntityRenderer;
import net.minecraft.client.renderer.RenderGlobal;
import net.minecraft.client.shader.ShaderGroup;
import net.minecraft.util.ResourceLocation;

@Mixin(EntityRenderer.class)
public abstract class MixinEntityRenderer implements IEntityRenderer
{
    @Shadow @Final private static ResourceLocation[] SHADERS_TEXTURES;
    @Shadow private boolean useShader;
    @Shadow private int shaderIndex;
    @Shadow private ShaderGroup shaderGroup;
    
    @Shadow abstract void loadShader(ResourceLocation resourceLocationIn);
    @Shadow abstract float getFOVModifier(float partialTicks, boolean useFOVSetting);
    @Shadow abstract void setupCameraTransform(float partialTicks, int pass);
    
    private LiteLoaderEventBrokerClient broker = LiteLoaderEventBrokerClient.getInstance();
    
    @Inject(method = "updateCameraAndRender(FJ)V", at = @At(
        value = "INVOKE",
        shift = Shift.AFTER,
        target = "Lnet/minecraft/client/renderer/GlStateManager;clear(I)V"
    ))
    private void onPreRenderGUI(float partialTicks, long nanoTime, CallbackInfo ci)
    {
        this.broker.preRenderGUI(partialTicks);
    }

    @Inject(method = "updateCameraAndRender(FJ)V", at = @At(
        value = "INVOKE",
        target = "Lnet/minecraft/client/gui/GuiIngame;renderGameOverlay(F)V"
    ))
    private void onRenderHUD(float partialTicks, long nanoTime, CallbackInfo ci)
    {
        this.broker.onRenderHUD(partialTicks);
    }
    
    @Inject(method = "updateCameraAndRender(FJ)V", at = @At(
        value = "INVOKE",
        shift = Shift.AFTER,
        target = "Lnet/minecraft/client/gui/GuiIngame;renderGameOverlay(F)V"
    ))
    private void onPostRenderHUD(float partialTicks, long nanoTime, CallbackInfo ci)
    {
        this.broker.postRenderHUD(partialTicks);
    }
    
    @Inject(method = "renderWorld(FJ)V", at = @At(
        value = "INVOKE",
        target = "Lnet/minecraft/profiler/Profiler;startSection(Ljava/lang/String;)V",
        ordinal = 0
    ))
    private void onRenderWorld(float partialTicks, long timeSlice, CallbackInfo ci)
    {
        this.broker.onRenderWorld(partialTicks, timeSlice);
    }
    
    @Inject(method = "renderWorld(FJ)V", at = @At(
        value = "INVOKE",
        target = "Lnet/minecraft/profiler/Profiler;endSection()V",
        ordinal = 0
    ))
    private void onPostRender(float partialTicks, long timeSlice, CallbackInfo ci)
    {
        this.broker.postRender(partialTicks, timeSlice);
    }
    
    @Inject(method = "renderWorldPass(IFJ)V", at = @At(
        value = "INVOKE_STRING",
        target = "Lnet/minecraft/profiler/Profiler;endStartSection(Ljava/lang/String;)V",
        args = "ldc=frustum"
    ))
    private void onSetupCameraTransform(int pass, float partialTicks, long timeSlice, CallbackInfo ci)
    {
        this.broker.onSetupCameraTransform(pass, partialTicks, timeSlice);
    }
    
    @Inject(method = "renderWorldPass(IFJ)V", at = @At(
        value = "INVOKE_STRING",
        target = "Lnet/minecraft/profiler/Profiler;endStartSection(Ljava/lang/String;)V",
        args = "ldc=sky"
    ))
    private void onRenderSky(int pass, float partialTicks, long timeSlice, CallbackInfo ci)
    {
        this.broker.onRenderSky(partialTicks, pass, timeSlice);
    }
    
    @Inject(method = "renderWorldPass(IFJ)V", at = @At(
        value = "INVOKE_STRING",
        target = "Lnet/minecraft/profiler/Profiler;endStartSection(Ljava/lang/String;)V",
        args = "ldc=terrain"
    ))
    private void onRenderTerrain(int pass, float partialTicks, long timeSlice, CallbackInfo ci)
    {
        this.broker.onRenderTerrain(partialTicks, pass, timeSlice);
    }
    
    @Inject(method = "renderWorldPass(IFJ)V", at = @At(
        value = "INVOKE_STRING",
        target = "Lnet/minecraft/profiler/Profiler;endStartSection(Ljava/lang/String;)V",
        args = "ldc=litParticles"
    ))
    private void onPostRenderEntities(int pass, float partialTicks, long timeSlice, CallbackInfo ci)
    {
        this.broker.postRenderEntities(partialTicks, timeSlice);
    }
    
    @Inject(method = "renderCloudsCheck(Lnet/minecraft/client/renderer/RenderGlobal;FIDDD)V", at = @At(
        value = "INVOKE",
        target = "Lnet/minecraft/profiler/Profiler;endStartSection(Ljava/lang/String;)V"
    ))
    private void onRenderClouds(RenderGlobal renderGlobalIn, float partialTicks, int pass, double x, double y, double z, CallbackInfo ci)
    {
        this.broker.onRenderClouds(partialTicks, pass, renderGlobalIn);
    }
    
    @Override
    public boolean getUseShader()
    {
        return this.useShader;
    }
    
    @Override
    public void setUseShader(boolean useShader)
    {
        this.useShader = useShader;
    }
    
    @Override
    public ResourceLocation[] getShaders()
    {
        return MixinEntityRenderer.SHADERS_TEXTURES;
    }
    
    @Override
    public int getShaderIndex()
    {
        return this.shaderIndex;
    }
    
    @Override
    public void setShaderIndex(int shaderIndex)
    {
        this.shaderIndex = shaderIndex;
    }
    
    @Override
    public void selectShader(ResourceLocation shader)
    {
        if (shader == null)
        {
            this.shaderGroup = null;
            this.useShader = false;
        }
        else 
        {
            this.loadShader(shader);
        }
    }
    
    @Override
    public float getFOV(float partialTicks, boolean useFOVSetting)
    {
        return this.getFOVModifier(partialTicks, useFOVSetting);
    }
    
    @Override
    public void setupCamera(float partialTicks, int pass)
    {
        this.setupCameraTransform(partialTicks, pass);
    }
    
}
