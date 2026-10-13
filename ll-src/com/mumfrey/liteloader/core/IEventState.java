/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.core;

import net.minecraft.server.MinecraftServer;


public interface IEventState
{
    public abstract void onTick(MinecraftServer server);
}
