/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.ducks;

import java.util.Map;

import net.minecraft.client.renderer.entity.Render;
import net.minecraft.entity.Entity;

public interface IRenderManager
{
    public abstract Map<Class<? extends Entity>, Render<? extends Entity>> getRenderMap();
}
