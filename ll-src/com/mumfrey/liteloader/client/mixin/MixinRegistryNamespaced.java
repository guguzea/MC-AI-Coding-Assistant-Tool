/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.mixin;

import org.spongepowered.asm.mixin.Final;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Shadow;

import com.mumfrey.liteloader.client.ducks.IIntIdentityHashBiMap;

import net.minecraft.util.IntIdentityHashBiMap;
import net.minecraft.util.registry.RegistryNamespaced;

@Mixin(RegistryNamespaced.class)
public abstract class MixinRegistryNamespaced<K, V> extends MixinRegistrySimple<K, V>
{
    @Shadow @Final protected IntIdentityHashBiMap<V> underlyingIntegerMap;

    @SuppressWarnings("unchecked")
    @Override
    public V removeObjectFromRegistry(K key)
    {
        V removed = super.removeObjectFromRegistry(key);
        if (removed != null && this.underlyingIntegerMap instanceof IIntIdentityHashBiMap)
        {
            ((IIntIdentityHashBiMap<V>)this.underlyingIntegerMap).removeObject(removed);
        }
        return removed;
    }
}
