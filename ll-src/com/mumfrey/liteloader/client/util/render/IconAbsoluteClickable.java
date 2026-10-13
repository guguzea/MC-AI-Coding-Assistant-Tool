/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.util.render;

import com.mumfrey.liteloader.util.render.IconClickable;

import net.minecraft.util.ResourceLocation;

public abstract class IconAbsoluteClickable extends IconAbsolute implements IconClickable
{
    public IconAbsoluteClickable(ResourceLocation textureResource, String displayText, int width, int height, float uCoord, float vCoord,
            float uCoord2, float vCoord2)
    {
        super(textureResource, displayText, width, height, uCoord, vCoord, uCoord2, vCoord2);
    }

    public IconAbsoluteClickable(ResourceLocation textureResource, String displayText, int width, int height, float uCoord, float vCoord,
            float uCoord2, float vCoord2, int texMapSize)
    {
        super(textureResource, displayText, width, height, uCoord, vCoord, uCoord2, vCoord2, texMapSize);
    }
}
