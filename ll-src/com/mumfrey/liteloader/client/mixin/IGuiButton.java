/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.mixin;

import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.gen.Accessor;

import net.minecraft.client.gui.GuiButton;

@Mixin(GuiButton.class)
public interface IGuiButton
{
    @Accessor("width")
    public abstract int getButtonWidth();
    
    @Accessor("height")
    public abstract int getButtonHeight();
}
