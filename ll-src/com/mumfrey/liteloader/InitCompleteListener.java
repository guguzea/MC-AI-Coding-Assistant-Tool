/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader;

import com.mumfrey.liteloader.core.LiteLoader;

import net.minecraft.client.Minecraft;

/**
 * Interface for mods which need to initialise stuff once the game
 * initialisation is completed, for example mods which need to register new
 * renderers.
 *
 * @author Adam Mummery-Smith
 */
public interface InitCompleteListener extends LiteMod
{
    /**
     * Called as soon as the game is initialised and the main game loop is
     * running.
     * 
     * @param minecraft Minecraft instance
     * @param loader LiteLoader instance
     */
    public abstract void onInitCompleted(Minecraft minecraft, LiteLoader loader);
}
