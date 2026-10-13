/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader;

import net.minecraft.server.MinecraftServer;

/**
 * Interface for mods which want to be ticked on the server thread
 *
 * @author Adam Mummery-Smith
 */
public interface ServerTickable extends LiteMod
{
    /**
     * Called at the start of every server update tick
     * 
     * @param server
     */
    public abstract void onTick(MinecraftServer server);
}
