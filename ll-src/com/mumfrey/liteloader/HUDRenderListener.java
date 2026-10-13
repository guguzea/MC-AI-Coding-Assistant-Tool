/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader;

/**
 * Interface for mods which want callbacks when the HUD is rendered
 * 
 * @author Adam Mummery-Smith
 */
public interface HUDRenderListener extends LiteMod
{
    public abstract void onPreRenderHUD(int screenWidth, int screenHeight);

    public abstract void onPostRenderHUD(int screenWidth, int screenHeight);
}
