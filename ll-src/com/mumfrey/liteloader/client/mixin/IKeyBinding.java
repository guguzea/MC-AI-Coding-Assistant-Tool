/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.mixin;

import java.util.Map;

import org.apache.commons.lang3.NotImplementedException;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.gen.Accessor;

import net.minecraft.client.settings.KeyBinding;

@Mixin(KeyBinding.class)
public interface IKeyBinding
{
    @Accessor(value = "CATEGORY_ORDER")
    public static Map<String, Integer> getCategorySort()
    {
        throw new NotImplementedException("IKeyBinding mixin failed to apply");
    }
}
