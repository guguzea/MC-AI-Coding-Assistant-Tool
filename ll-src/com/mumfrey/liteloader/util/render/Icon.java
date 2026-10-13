/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.util.render;

public interface Icon
{
    public abstract int getIconWidth();
    public abstract int getIconHeight();
    public abstract float getMinU();
    public abstract float getMaxU();
    public abstract float getInterpolatedU(double slice);
    public abstract float getMinV();
    public abstract float getMaxV();
    public abstract float getInterpolatedV(double slice);
    public abstract String getIconName();
}
