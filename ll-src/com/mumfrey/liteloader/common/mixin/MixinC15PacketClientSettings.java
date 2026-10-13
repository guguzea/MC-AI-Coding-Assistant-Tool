/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.common.mixin;

import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Shadow;

import com.mumfrey.liteloader.common.ducks.IPacketClientSettings;

import net.minecraft.network.play.client.CPacketClientSettings;

@Mixin(CPacketClientSettings.class)
public abstract class MixinC15PacketClientSettings implements IPacketClientSettings
{
    @Shadow private int view;
    
    @Override
    public int getViewDistance()
    {
        return this.view;
    }
}
