/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.gui.modlist;

import com.mumfrey.liteloader.client.gui.GuiLiteLoaderPanel;

public interface ModListContainer
{
    public abstract GuiLiteLoaderPanel getParentScreen();

    public abstract void setEnableButtonVisible(boolean visible);

    public abstract void setConfigButtonVisible(boolean visible);

    public abstract void setEnableButtonText(String displayString);

    public abstract void showConfig();

    public abstract void scrollTo(int yPos, int modHeight);
}
