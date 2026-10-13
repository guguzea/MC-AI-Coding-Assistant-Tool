/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader;

import com.mojang.realmsclient.dto.RealmsServer;

import net.minecraft.client.multiplayer.ServerData;
import net.minecraft.network.INetHandler;
import net.minecraft.network.play.server.SPacketJoinGame;


/**
 * Interface for mods which wish to be notified when the player connects to a
 * server (or local game).
 *
 * @author Adam Mummery-Smith
 */
public interface JoinGameListener extends LiteMod
{
    /**
     * Called on join game
     * 
     * @param netHandler Net handler
     * @param joinGamePacket Join game packet
     * @param serverData ServerData object representing the server being
     *      connected to
     * @param realmsServer If connecting to a realm, a reference to the
     *      RealmsServer object
     */
    public abstract void onJoinGame(INetHandler netHandler, SPacketJoinGame joinGamePacket, ServerData serverData, RealmsServer realmsServer);
}
