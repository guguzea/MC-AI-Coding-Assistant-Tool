/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.mixin;

import java.io.File;

import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;

import com.mumfrey.liteloader.client.LiteLoaderEventBrokerClient;

import net.minecraft.client.shader.Framebuffer;
import net.minecraft.util.ScreenShotHelper;
import net.minecraft.util.text.ITextComponent;

@Mixin(ScreenShotHelper.class)
public abstract class MixinScreenShotHelper
{
    @Inject(
        method = "saveScreenshot(Ljava/io/File;Ljava/lang/String;IILnet/minecraft/client/shader/Framebuffer;)"
                + "Lnet/minecraft/util/text/ITextComponent;",
        at = @At(
            value = "INVOKE",
            target = "Lnet/minecraft/util/ScreenShotHelper;createScreenshot(IILnet/minecraft/client/shader/Framebuffer;)"
                    + "Ljava/awt/image/BufferedImage;",
            ordinal = 0
        ),
        cancellable = true
    )
    private static void onSaveScreenshot(File gameDir, String name, int width, int height, Framebuffer fbo, CallbackInfoReturnable<ITextComponent> ci)
    {
        LiteLoaderEventBrokerClient.getInstance().onScreenshot(ci, name, width, height, fbo);
    }
}
