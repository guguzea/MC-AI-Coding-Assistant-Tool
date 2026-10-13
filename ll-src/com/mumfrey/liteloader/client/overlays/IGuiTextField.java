/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.overlays;

/**
 * Adapter for GuiTextField to expose internal properties, mainly to allow
 * sensible subclassing.
 * 
 * @author Adam Mummery-Smith
 */
public interface IGuiTextField
{
    public abstract int     getXPosition();
    public abstract void    setXPosition(int xPosition);
    public abstract int     getYPosition();
    public abstract void    setYPosition(int yPosition);
    public abstract int     getInternalWidth();
    public abstract void    setInternalWidth(int width);
    public abstract int     getHeight();
    public abstract void    setHeight(int height);
    public abstract boolean isEnabled();
    public abstract int     getLineScrollOffset();
    public abstract int     getTextColor();
    public abstract int     getDisabledTextColour();
    
}
