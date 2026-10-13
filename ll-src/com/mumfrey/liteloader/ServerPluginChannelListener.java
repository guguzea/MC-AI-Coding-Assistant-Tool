/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader;

import com.mumfrey.liteloader.core.CommonPluginChannelListener;

import net.minecraft.entity.player.EntityPlayerMP;
import net.minecraft.network.PacketBuffer;

/**
 * Interface for mods which want to use plugin channels on the (integrated)
 * server side.
 *
 * @author Adam Mummery-Smith
 */
public interface ServerPluginChannelListener extends CommonPluginChannelListener
{
    /**
     * Called when a custom payload packet arrives on a channel this mod has
     * registered.
     *
     * @param sender Player object which is the source of this message
     * @param channel Channel on which the custom payload was received
     * @param data Custom payload data
     */
    public abstract void onCustomPayload(EntityPlayerMP sender, String channel, PacketBuffer data);
}
