/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.ducks;

import java.util.List;

import net.minecraft.client.resources.IResourceManagerReloadListener;

public interface IReloadable
{
    public abstract List<IResourceManagerReloadListener> getReloadListeners();
}
