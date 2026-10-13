/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.common.transformers;

import com.mumfrey.liteloader.transformers.event.EventInfo;

import net.minecraft.network.Packet;

public class PacketEventInfo<S extends Packet<?>> extends EventInfo<S>
{
    private final int packetId;

    @SuppressWarnings("unchecked")
    public PacketEventInfo(String name, Object source, boolean cancellable, int packetId)
    {
        super(name, (S)source, cancellable);

        this.packetId = packetId;
    }

    public int getPacketId()
    {
        return this.packetId;
    }
}
