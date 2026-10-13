/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.common.transformers;

import com.mumfrey.liteloader.core.runtime.Obf;
import com.mumfrey.liteloader.core.runtime.Packets;
import com.mumfrey.liteloader.transformers.event.EventInjectionTransformer;
import com.mumfrey.liteloader.transformers.event.InjectionPoint;
import com.mumfrey.liteloader.transformers.event.MethodInfo;
import com.mumfrey.liteloader.transformers.event.inject.MethodHead;

public class LiteLoaderPacketTransformer extends EventInjectionTransformer
{
    @Override
    protected void addEvents()
    {
        InjectionPoint methodHead = new MethodHead();
        MethodInfo handlePacket = new MethodInfo(Obf.PacketEvents, "handlePacket");

        for (Packets packet : Packets.packets)
        {
            MethodInfo processPacket = new MethodInfo(packet, Obf.processPacket, Void.TYPE, Obf.INetHandler);
            this.addEvent(new PacketEvent(packet), processPacket, methodHead).addListener(handlePacket);
        }
    }
}
