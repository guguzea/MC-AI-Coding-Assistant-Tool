/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader;

import net.minecraft.client.gui.ScaledResolution;

public interface ViewportListener extends LiteMod
{
    public abstract void onViewportResized(ScaledResolution resolution, int displayWidth, int displayHeight);

    public abstract void onFullScreenToggled(boolean fullScreen);
}
