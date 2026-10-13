/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.mixin;

import java.util.List;

import org.spongepowered.asm.mixin.Final;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Shadow;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.At.Shift;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.Redirect;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

import com.mumfrey.liteloader.PlayerInteractionListener.MouseButton;
import com.mumfrey.liteloader.client.LiteLoaderEventBrokerClient;
import com.mumfrey.liteloader.client.ducks.IFramebuffer;
import com.mumfrey.liteloader.client.gui.startup.LoadingBar;
import com.mumfrey.liteloader.client.overlays.IMinecraft;
import com.mumfrey.liteloader.launch.LiteLoaderTweaker;

import net.minecraft.client.Minecraft;
import net.minecraft.client.renderer.OpenGlHelper;
import net.minecraft.client.resources.IResourcePack;
import net.minecraft.client.shader.Framebuffer;
import net.minecraft.util.Timer;

@Mixin(Minecraft.class)
public abstract class MixinMinecraft implements IMinecraft
{
    @Shadow @Final private Timer timer;
    @Shadow volatile boolean running;
    @Shadow @Final private List<IResourcePack> defaultResourcePacks;
    @Shadow private String serverName;
    @Shadow private int serverPort;
    @Shadow private boolean isGamePaused;
    @Shadow private float renderPartialTicksPaused;
    
    @Shadow abstract void resize(int width, int height);
    @Shadow private void clickMouse() {}
    @Shadow private void rightClickMouse() {}
    @Shadow private void middleClickMouse() {}
    
    private LiteLoaderEventBrokerClient broker;
    
    @Inject(method = "init()V", at = @At(value = "NEW", target = "net/minecraft/client/renderer/EntityRenderer"))
    private void init(CallbackInfo ci)
    {
        LiteLoaderTweaker.init();
        LiteLoaderTweaker.postInit();
    }
    
    @Inject(method = "init()V", at = @At(value = "NEW", target = "net/minecraft/client/renderer/texture/TextureMap"))
    private void initTextures(CallbackInfo ci)
    {
        LoadingBar.initTextures();
    }
    
    @Inject(method = "init()V", at = @At("INVOKE"))
    private void progress(CallbackInfo ci)
    {
        LoadingBar.incrementProgress();
    }
    
    @Inject(method = "init()V", at = @At("RETURN"))
    private void onStartupComplete(CallbackInfo ci)
    {
        this.broker = LiteLoaderEventBrokerClient.getInstance();

        if (this.broker == null)
        {
            throw new RuntimeException("LiteLoader failed to start up properly."
                    + " The game is in an unstable state and must shut down now. Check the developer log for startup errors");
        }

        this.broker.onStartupComplete();
    }
    
    @Inject(method = "updateFramebufferSize()V", at = @At("HEAD"))
    private void onResize(CallbackInfo ci)
    {
        if (this.broker != null)
        {
            this.broker.onResize((Minecraft)(Object)this);
        }
    }
    
    @Inject(method = "runTick()V", at = @At("HEAD"))
    private void newTick(CallbackInfo ci)
    {
//        ClientProxy.newTick();
    }
    
    @Inject(method = "runGameLoop()V", at = @At(
        value = "INVOKE",
        shift = Shift.AFTER,
        target = "Lnet/minecraft/client/renderer/EntityRenderer;updateCameraAndRender(FJ)V"
    ))
    private void onTick(CallbackInfo ci)
    {
        boolean clock = this.timer.field_74280_b > 0;
        float partialTicks = this.isGamePaused ? this.renderPartialTicksPaused : this.timer.field_194147_b;
        this.broker.onTick(clock, partialTicks);
    }
    
    @Redirect(method = "runGameLoop()V", at = @At(
        value = "INVOKE",
        target = "Lnet/minecraft/client/shader/Framebuffer;framebufferRender(II)V"
    ))
    private void renderFBO(Framebuffer framebufferMc, int width, int height)
    {
        boolean fboEnabled = OpenGlHelper.func_148822_b();
        if (fboEnabled && this.broker != null)
        {
            if (framebufferMc instanceof IFramebuffer)
            {
                ((IFramebuffer)framebufferMc).setDispatchRenderEvent(true);            
            }
            this.broker.preRenderFBO(framebufferMc);
            
            framebufferMc.func_147615_c(width, height);
            
            this.broker.postRenderFBO(framebufferMc);
        }
        else
        {
            framebufferMc.func_147615_c(width, height);
        }
    }
    
    @Inject(method = "runGameLoop()V", at = @At(
        value = "INVOKE_STRING",
        target = "Lnet/minecraft/profiler/Profiler;startSection(Ljava/lang/String;)V",
        args = "ldc=tick"
    ))
    private void onTimerUpdate(CallbackInfo ci)
    {
        this.broker.onTimerUpdate();
    }
    
    @Inject(method = "runGameLoop()V", at = @At(
        value = "INVOKE_STRING",
        target = "Lnet/minecraft/profiler/Profiler;endStartSection(Ljava/lang/String;)V",
        args = "ldc=gameRenderer"
    ))
    private void onRender(CallbackInfo ci)
    {
        this.broker.onRender();
    }
    
    @Redirect(method = "processKeyBinds()V", at = @At(
        value = "INVOKE",
        target = "Lnet/minecraft/client/Minecraft;clickMouse()V"
    ))
    private void onClickMouse(Minecraft self)
    {
        if (this.broker.onClickMouse(self.field_71439_g, MouseButton.LEFT))
        {
            this.clickMouse();
        }
    }
    
    @Inject(method = "sendClickBlockToController(Z)V", at = @At(
            value = "FIELD",
            target = "Lnet/minecraft/client/Minecraft;objectMouseOver:Lnet/minecraft/util/math/RayTraceResult;",
            ordinal = 0
        ),
        cancellable = true
    )
    private void onMouseHeld(boolean leftClick, CallbackInfo ci)
    {
        if (!this.broker.onMouseHeld(((Minecraft)(Object)this).field_71439_g, MouseButton.LEFT))
        {
            ci.cancel();
        }
    }
    
    @Redirect(method = "processKeyBinds()V", at = @At(
            value = "INVOKE",
            target = "Lnet/minecraft/client/Minecraft;rightClickMouse()V",
            ordinal = 0
    ))
    private void onRightClickMouse(Minecraft self)
    {
        if (this.broker.onClickMouse(self.field_71439_g, MouseButton.RIGHT))
        {
            this.rightClickMouse();
        }
    }
    
    @Redirect(method = "processKeyBinds()V", at = @At(
            value = "INVOKE",
            target = "Lnet/minecraft/client/Minecraft;rightClickMouse()V",
            ordinal = 1
    ))
    private void onRightMouseHeld(Minecraft self)
    {
        if (this.broker.onMouseHeld(self.field_71439_g, MouseButton.RIGHT))
        {
            this.rightClickMouse();
        }
    }
    
    @Redirect(method = "processKeyBinds()V", at = @At(
            value = "INVOKE",
            target = "Lnet/minecraft/client/Minecraft;middleClickMouse()V"
    ))
    private void onMiddleClickMouse(Minecraft self)
    {
        if (this.broker.onClickMouse(self.field_71439_g, MouseButton.MIDDLE))
        {
            this.middleClickMouse();
        }
    }

    @Override
    public Timer getTimer()
    {
        return this.timer;
    }

    @Override
    public boolean isRunning()
    {
        return this.running;
    }

    @Override
    public List<IResourcePack> getDefaultResourcePacks()
    {
        return this.defaultResourcePacks;
    }

    @Override
    public String getServerName()
    {
        return this.serverName;
    }

    @Override
    public int getServerPort()
    {
        return this.serverPort;
    }

    @Override
    public void onResizeWindow(int width, int height)
    {
        this.resize(width, height);
    }
    
}
