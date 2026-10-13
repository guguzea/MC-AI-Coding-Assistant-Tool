/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader;

import com.mumfrey.liteloader.core.LiteLoaderEventBroker.ReturnValue;

import net.minecraft.client.shader.Framebuffer;
import net.minecraft.util.text.ITextComponent;

/**
 * Interface for mods which want to handle or inhibit the saving of screenshots
 * 
 * @author Adam Mummery-Smith
 */
public interface ScreenshotListener extends LiteMod
{
    /**
     * Called when a screenshot is taken, mods should return FALSE to suspend
     * further processing, or TRUE to allow processing to continue normally
     * 
     * @param screenshotName
     * @param width
     * @param height
     * @param fbo
     * @param message Message to return if the event is cancelled
     * @return FALSE to suspend further processing, or TRUE to allow processing
     *      to continue normally
     */
    public boolean onSaveScreenshot(String screenshotName, int width, int height, Framebuffer fbo, ReturnValue<ITextComponent> message);
}
