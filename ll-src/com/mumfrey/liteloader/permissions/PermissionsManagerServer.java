/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.permissions;

import java.util.List;

import com.mumfrey.liteloader.Permissible;
import com.mumfrey.liteloader.ServerPluginChannelListener;
import com.mumfrey.liteloader.common.GameEngine;

import net.minecraft.entity.player.EntityPlayerMP;
import net.minecraft.network.PacketBuffer;

/**
 * TODO implementation
 * 
 * @author Adam Mummery-Smith
 */
public class PermissionsManagerServer implements PermissionsManager, ServerPluginChannelListener
{
    public PermissionsManagerServer()
    {
    }

    @Override
    public String getName()
    {
        return null;
    }

    @Override
    public void onCustomPayload(EntityPlayerMP sender, String channel, PacketBuffer data)
    {
    }

    @Override
    public Permissions getPermissions(Permissible mod)
    {
        return null;
    }

    @Override
    public Long getPermissionUpdateTime(Permissible mod)
    {
        return null;
    }

    @Override
    public void onTick(GameEngine<?, ?> engine, float partialTicks, boolean inGame)
    {
    }

    @Override
    public List<String> getChannels()
    {
        return null;
    }

    @Override
    public void registerPermissible(Permissible permissible)
    {
    }

    @Override
    public void tamperCheck()
    {
    }
}
