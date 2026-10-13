/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.interfaces;

import com.mumfrey.liteloader.common.GameEngine;
import com.mumfrey.liteloader.core.ClientPluginChannels;
import com.mumfrey.liteloader.core.LiteLoaderEventBroker;
import com.mumfrey.liteloader.core.PacketEvents;
import com.mumfrey.liteloader.core.ServerPluginChannels;
import com.mumfrey.liteloader.permissions.PermissionsManagerClient;
import com.mumfrey.liteloader.permissions.PermissionsManagerServer;
import com.mumfrey.liteloader.util.Input;

import net.minecraft.server.MinecraftServer;

/**
 * Factory for generating loader managament objects based on the environment
 * 
 * @author Adam Mummery-Smith
 *
 * @param <TClient> Type of the client runtime, "Minecraft" on client and null
 *      on the server
 * @param <TServer> Type of the server runtime, "IntegratedServer" on the client
 *      "MinecraftServer" on the server 
 */
public interface ObjectFactory<TClient, TServer extends MinecraftServer>
{
    public abstract LiteLoaderEventBroker<TClient, TServer> getEventBroker();

    public abstract PacketEvents getPacketEventBroker();

    public abstract Input getInput();

    public abstract GameEngine<TClient, TServer> getGameEngine();

    public abstract PanelManager<?> getPanelManager();

    public abstract ClientPluginChannels getClientPluginChannels();

    public abstract ServerPluginChannels getServerPluginChannels();

    public abstract PermissionsManagerClient getClientPermissionManager();

    public abstract PermissionsManagerServer getServerPermissionManager();

    public abstract void preBeginGame();
}
