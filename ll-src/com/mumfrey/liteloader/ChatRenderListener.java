/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader;

import net.minecraft.client.gui.GuiNewChat;

/**
 * Interface for mods which want to alter the chat display
 * 
 * @author Adam Mummery-Smith
 */
public interface ChatRenderListener extends LiteMod
{
    public abstract void onPreRenderChat(int screenWidth, int screenHeight, GuiNewChat chat);

    public abstract void onPostRenderChat(int screenWidth, int screenHeight, GuiNewChat chat);
}
