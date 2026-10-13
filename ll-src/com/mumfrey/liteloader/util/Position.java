/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.util;

import net.minecraft.entity.Entity;
import net.minecraft.util.math.Vec3d;

/**
 * A 3D vector position with rotation as well
 * 
 * @author Adam Mummery-Smith
 */
public class Position extends Vec3d
{
    public final float yaw;

    public final float pitch;

    public Position(double x, double y, double z)
    {
        this(x, y, z, 0.0F, 0.0F);
    }

    public Position(double x, double y, double z, float yaw, float pitch)
    {
        super(x, y, z);

        this.yaw = yaw;
        this.pitch = pitch;
    }

    public Position(Entity entity)
    {
        this(entity.field_70165_t, entity.field_70163_u, entity.field_70161_v, entity.field_70177_z, entity.field_70125_A);
    }

    public Position(Entity entity, boolean usePrevious)
    {
        this(usePrevious ? entity.field_70169_q : entity.field_70165_t,
             usePrevious ? entity.field_70167_r : entity.field_70163_u,
             usePrevious ? entity.field_70166_s : entity.field_70161_v,
             usePrevious ? entity.field_70126_B : entity.field_70177_z,
             usePrevious ? entity.field_70127_C : entity.field_70125_A);
    }

    public void applyTo(Entity entity)
    {
        entity.field_70165_t = this.field_72450_a;
        entity.field_70163_u = this.field_72448_b;
        entity.field_70161_v = this.field_72449_c;
        entity.field_70177_z = this.yaw;
        entity.field_70125_A = this.pitch;
    }

    @Override
    public String toString()
    {
        return "(" + this.field_72450_a + ", " + this.field_72448_b + ", " + this.field_72449_c + ", " + this.yaw + ", " + this.pitch + ")";
    }
}
