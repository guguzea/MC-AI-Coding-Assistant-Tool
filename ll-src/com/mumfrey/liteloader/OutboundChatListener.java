/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader;

import net.minecraft.network.play.client.CPacketChatMessage;

/**
 * Interface for mods which want to monitor outbound chat
 *
 * @author Adam Mummery-Smith
 */
public interface OutboundChatListener extends LiteMod
{
    /**
     * Raised when a new chat packet is created (not necessarily transmitted,
     * something could be trolling us).
     * 
     * @param packet
     * @param message
     */
    public abstract void onSendChatMessage(CPacketChatMessage packet, String message);
}
