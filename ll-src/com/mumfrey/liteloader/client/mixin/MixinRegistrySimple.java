/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.mixin;

import java.util.Map;

import org.spongepowered.asm.mixin.Final;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Shadow;

import com.mumfrey.liteloader.client.ducks.IMutableRegistry;

import net.minecraft.util.registry.RegistrySimple;

@Mixin(RegistrySimple.class)
public abstract class MixinRegistrySimple<K, V> implements IMutableRegistry<K, V>
{
    @Shadow private Object[] values;
    @Shadow @Final protected Map<K, V> registryObjects;
    
    @Override
    public V removeObjectFromRegistry(K key)
    {
        this.values = null;
        return this.registryObjects.remove(key);
    }
}
