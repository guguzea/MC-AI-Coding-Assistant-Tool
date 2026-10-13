/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.mixin;

import org.spongepowered.asm.mixin.Final;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Mutable;
import org.spongepowered.asm.mixin.Shadow;

import com.mumfrey.liteloader.client.overlays.IGuiTextField;

import net.minecraft.client.gui.GuiTextField;

@Mixin(GuiTextField.class)
public abstract class MixinGuiTextField implements IGuiTextField
{
    @Shadow @Final @Mutable private int width;
    @Shadow @Final @Mutable private int height;
    @Shadow public int x;
    @Shadow public int y;
    @Shadow private int lineScrollOffset;
    @Shadow private int enabledColor;
    @Shadow private int disabledColor;
    @Shadow private boolean isEnabled;
    
    @Override
    public int getXPosition()
    {
        return this.x;
    }
    
    @Override
    public void setXPosition(int xPosition)
    {
        this.x = xPosition;
    }
    
    @Override
    public int getYPosition()
    {
        return this.y;
    }
    
    @Override
    public void setYPosition(int yPosition)
    {
        this.y = yPosition;
    }
    
    @Override
    public int getInternalWidth()
    {
        return this.width;
                
    }
    
    @Override
    public void setInternalWidth(int width)
    {
        this.width = width;
    }
    
    @Override
    public int getHeight()
    {
        return this.height;
    }
    
    @Override
    public void setHeight(int height)
    {
        this.height = height;
    }
    
    @Override
    public boolean isEnabled()
    {
        return this.isEnabled;
    }
    
    @Override
    public int getLineScrollOffset()
    {
        return this.lineScrollOffset;
    }
    
    @Override
    public int getTextColor()
    {
        return this.enabledColor;
    }
    
    @Override
    public int getDisabledTextColour()
    {
        return this.disabledColor;
    }
}
