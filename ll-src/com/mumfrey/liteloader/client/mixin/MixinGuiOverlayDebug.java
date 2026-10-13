/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.mixin;

import java.util.ArrayList;
import java.util.List;

import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Shadow;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.Redirect;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

import com.google.common.collect.Lists;
import com.mumfrey.liteloader.core.LiteLoader;
import com.mumfrey.liteloader.util.debug.DebugMessage;
import com.mumfrey.liteloader.util.debug.DebugMessage.Position;

import net.minecraft.client.gui.Gui;
import net.minecraft.client.gui.GuiOverlayDebug;
import net.minecraft.client.resources.I18n;

@Mixin(GuiOverlayDebug.class)
public abstract class MixinGuiOverlayDebug extends Gui
{
    @Shadow protected abstract List<String> call();
    @Shadow protected abstract <T extends Comparable<T>> List<String> getDebugInfoRight();
    
    private boolean captureNextCall = false;
    
    @SuppressWarnings("unchecked")
    @Redirect(method = "getDebugInfoRight", at = @At(value = "INVOKE", remap = false,
            target = "Lcom/google/common/collect/Lists;newArrayList([Ljava/lang/Object;)Ljava/util/ArrayList;"))
    private <E> ArrayList<E> addLoaderBranding(E... elements)
    {
        ArrayList<E> list = Lists.newArrayList(elements);
        list.add((E)"");
        list.add((E)LiteLoader.getVersionDisplayString());
        String branding = LiteLoader.getBranding();
        if (branding != null)
        {
            list.add((E)branding);
        }
        list.add((E)I18n.func_135052_a("gui.about.modsloaded", LiteLoader.getLoadedModsCount()));
        return list;
    }
    
    @Inject(method = "renderDebugInfoLeft()V", at = @At(value = "HEAD"))
    private void onRenderDebugInfoLeft(CallbackInfo ci)
    {
        this.captureNextCall = true;
    }
    
    @Redirect(method = "renderDebugInfoLeft()V", at = @At(value = "INVOKE", remap = false, target = "Ljava/util/List;size()I"))
    private int getSize(List<String> list)
    {
        if (this.captureNextCall)
        {
            this.captureNextCall = false;
            List<String> messages = DebugMessage.getMessages(Position.LEFT_BOTTOM);
            if (messages != null)
            {
                list.addAll(messages);
            }
        }
        
        return list.size();
    }
    
    @Redirect(method = "renderDebugInfoLeft()V", at = @At(value = "INVOKE",
            target = "Lnet/minecraft/client/gui/GuiOverlayDebug;call()Ljava/util/List;"))
    private List<String> onGetDebugInfoLeft(GuiOverlayDebug self)
    {
        List<String> list = this.call();
        
        List<String> topMessages = DebugMessage.getMessages(Position.LEFT_TOP);
        if (topMessages != null)
        {
            list.addAll(1, topMessages);
        }
        
        List<String> midMessages = DebugMessage.getMessages(Position.LEFT_AFTER_INFO);
        if (midMessages != null)
        {
            list.addAll(midMessages);
        }
        
        return list;
    }
    
    @Redirect(method = "renderDebugInfoRight(Lnet/minecraft/client/gui/ScaledResolution;)V",
            at = @At(value = "INVOKE", target = "Lnet/minecraft/client/gui/GuiOverlayDebug;getDebugInfoRight()Ljava/util/List;"))
    private <T extends Comparable<T>> List<String> onGetDebugInfoRight(GuiOverlayDebug self)
    {
        List<String> list = this.getDebugInfoRight();
        
        List<String> topMessages = DebugMessage.getMessages(Position.RIGHT_TOP);
        if (topMessages != null)
        {
            list.addAll(0, topMessages);
            list.add(null);
        }
        
        List<String> bottomMessages = DebugMessage.getMessages(Position.RIGHT_BOTTOM);
        if (bottomMessages != null)
        {
            list.add(null);
            list.addAll(bottomMessages);
        }
        
        return list;
    }
}
