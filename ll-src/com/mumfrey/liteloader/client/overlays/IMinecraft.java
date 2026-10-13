/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.overlays;

import java.util.List;

import net.minecraft.client.resources.IResourcePack;
import net.minecraft.util.Timer;

/**
 * Interface containing injected accessors for Minecraft
 *
 * @author Adam Mummery-Smith
 */
public interface IMinecraft
{
    /**
     * Get the timer instance
     */
    public abstract Timer getTimer();

    /**
     * Get the "running" flag
     */
    public abstract boolean isRunning();

    /**
     * Get the default resource packs set
     */
    public abstract List<IResourcePack> getDefaultResourcePacks();

    /**
     * Get the current server address (from connection)
     */
    public abstract String getServerName();

    /**
     * Get the current server port (from connection)
     */
    public abstract int getServerPort();

    /**
     * Notify the client that the window was resized
     * 
     * @param width
     * @param height
     */
    public abstract void onResizeWindow(int width, int height);
    
}
