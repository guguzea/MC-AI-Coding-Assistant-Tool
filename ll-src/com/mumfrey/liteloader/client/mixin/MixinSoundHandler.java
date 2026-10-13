/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.mixin;

import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Shadow;

import com.mumfrey.liteloader.client.overlays.ISoundHandler;

import net.minecraft.client.audio.SoundHandler;
import net.minecraft.client.audio.SoundList;
import net.minecraft.util.ResourceLocation;

@Mixin(SoundHandler.class)
public abstract class MixinSoundHandler implements ISoundHandler
{
    
    @Shadow abstract void loadSoundResource(ResourceLocation location, SoundList sounds);
    
    @Override
    public void addSound(ResourceLocation sound, SoundList soundList)
    {
        this.loadSoundResource(sound, soundList);
    }
    
}
