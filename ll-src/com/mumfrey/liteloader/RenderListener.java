/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader;

import net.minecraft.client.gui.GuiScreen;

/**
 * Interface for objects which want a pre-render callback
 * 
 * @author Adam Mummery-Smith
 */
public interface RenderListener extends LiteMod
{
    /**
     * Callback when a frame is rendered
     */
    public abstract void onRender();

    /**
     * Called immediately before the current GUI is rendered
     * 
     * @param currentScreen Current screen (if any)
     */
    public abstract void onRenderGui(GuiScreen currentScreen);

    /**
     * Called immediately after the world/camera transform is initialised
     */
    public abstract void onSetupCameraTransform();
}
