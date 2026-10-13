/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader;

import net.minecraft.network.login.INetHandlerLoginClient;
import net.minecraft.network.login.server.SPacketLoginSuccess;

/**
 *
 * @author Adam Mummery-Smith
 */
public interface PostLoginListener extends LiteMod
{
    /**
     * Called immediately after login, before the player has properly joined the
     * game. Note that this event is raised <b>in the network thread</b> and is
     * not marshalled to the main thread as other packet-generated events are.
     * 
     * @param netHandler
     * @param packet
     */
    public abstract void onPostLogin(INetHandlerLoginClient netHandler, SPacketLoginSuccess packet);
}
