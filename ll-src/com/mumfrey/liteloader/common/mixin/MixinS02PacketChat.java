/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.common.mixin;

import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Shadow;

import com.mumfrey.liteloader.common.ducks.IChatPacket;

import net.minecraft.network.play.server.SPacketChat;
import net.minecraft.util.text.ITextComponent;

@Mixin(SPacketChat.class)
public abstract class MixinS02PacketChat implements IChatPacket
{
    @Shadow private ITextComponent chatComponent;
    
    @Override
    public ITextComponent getChatComponent()
    {
        return this.chatComponent;
    }
    
    @Override
    public void setChatComponent(ITextComponent chatComponent)
    {
        this.chatComponent = chatComponent;
    }
}
