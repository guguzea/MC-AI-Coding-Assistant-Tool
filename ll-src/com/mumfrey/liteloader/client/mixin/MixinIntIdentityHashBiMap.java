/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.mixin;

import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Shadow;

import com.mumfrey.liteloader.client.ducks.IIntIdentityHashBiMap;

import net.minecraft.util.IntIdentityHashBiMap;

@Mixin(IntIdentityHashBiMap.class)
public abstract class MixinIntIdentityHashBiMap<V> implements IIntIdentityHashBiMap<V>
{
    @Shadow private V[] values;
    @Shadow private int[] intKeys;
    @Shadow private V[] byId;
    @Shadow private int nextFreeIndex;
    @Shadow private int mapSize;
    
    @Shadow private int getIndex(V object, int hash)
    {
        return -1;
    }
    
    @Shadow private int hashObject(V object)
    {
        return -1;
    }

    @Override
    public void removeObject(V object)
    {
        int index = this.getIndex(object, this.hashObject(object));
        int intKey = this.intKeys[index];
        this.values[index] = null;
        this.intKeys[index] = 0;
        this.byId[intKey] = null;
    }
}
