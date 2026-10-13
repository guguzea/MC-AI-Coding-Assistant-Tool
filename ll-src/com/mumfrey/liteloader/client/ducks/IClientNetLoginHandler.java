/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.ducks;

import net.minecraft.network.NetworkManager;

public interface IClientNetLoginHandler
{
    public abstract NetworkManager getNetMgr();
}
