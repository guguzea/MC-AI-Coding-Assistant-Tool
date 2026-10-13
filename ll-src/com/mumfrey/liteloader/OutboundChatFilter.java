/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader;

/**
 * Interface for mods which want to filter outbound chat
 *
 * @author Adam Mummery-Smith
 */
public interface OutboundChatFilter extends LiteMod
{
    /**
     * Raised when a chat message is being sent, return false to filter this
     * message or true to allow it to be sent.
     * 
     * @param message
     */
    public abstract boolean onSendChatMessage(String message); 
}
