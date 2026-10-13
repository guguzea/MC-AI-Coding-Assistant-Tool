/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.common.ducks;

import net.minecraft.util.math.Vec3d;

public interface ITeleportHandler
{
    public abstract int beginTeleport(Vec3d location);
}
