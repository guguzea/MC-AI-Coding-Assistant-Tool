/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.util;

import java.util.List;

import com.google.common.base.Predicate;
import com.google.common.base.Predicates;

import net.minecraft.entity.Entity;
import net.minecraft.util.EntitySelectors;
import net.minecraft.util.math.AxisAlignedBB;
import net.minecraft.util.math.RayTraceResult;
import net.minecraft.util.math.Vec3d;

public abstract class EntityUtilities
{
    static final Predicate<Entity> TRACEABLE = Predicates.and(EntitySelectors.field_180132_d, new Predicate<Entity>()
    {
        @Override
        public boolean apply(Entity entity)
        {
            return entity != null && entity.func_70067_L();
        }
    });
    
    static final class EntityTrace
    {
        Entity entity;
        Vec3d location;
        double distance;
        
        EntityTrace(double entityDistance)
        {
            this.distance = entityDistance;
        }

        RayTraceResult asRayTraceResult()
        {
            return new RayTraceResult(this.entity, this.location);
        }
    }
    
    public static RayTraceResult rayTraceFromEntity(Entity source, double traceDistance, float partialTicks, boolean includeEntities)
    {
        RayTraceResult blockRay = EntityUtilities.rayTraceFromEntity(source, traceDistance, partialTicks);
        
        if (!includeEntities)
        {
            return blockRay;
        }
        
        Vec3d traceStart = EntityUtilities.getPositionEyes(source, partialTicks);
        double blockDistance = (blockRay != null) ? blockRay.field_72307_f.func_72438_d(traceStart) : traceDistance;
        EntityTrace entityRay = EntityUtilities.rayTraceEntities(source, traceDistance, partialTicks, blockDistance, traceStart);

        if (entityRay.entity != null && (entityRay.distance < blockDistance || blockRay == null))
        {
            return entityRay.asRayTraceResult();
        }

        return blockRay;
    }

    private static EntityTrace rayTraceEntities(Entity source, double traceDistance, float partialTicks, double blockDistance, Vec3d traceStart)
    {
        EntityTrace trace = new EntityTrace(blockDistance);
        
        Vec3d lookDir = source.func_70676_i(partialTicks).func_186678_a(traceDistance);
        Vec3d traceEnd = traceStart.func_178787_e(lookDir);
        
        for (final Entity entity : EntityUtilities.getTraceEntities(source, traceDistance, lookDir, EntityUtilities.TRACEABLE)) 
        {
            AxisAlignedBB entityBB = entity.func_174813_aQ().func_186662_g(entity.func_70111_Y());
            RayTraceResult entityRay = entityBB.func_72327_a(traceStart, traceEnd);

            if (entityBB.func_72318_a(traceStart))
            {
                if (trace.distance >= 0.0D)
                {
                    trace.entity = entity;
                    trace.location = entityRay == null ? traceStart : entityRay.field_72307_f;
                    trace.distance = 0.0D;
                }
                continue;
            }
            
            if (entityRay == null)
            {
                continue;
            }
            
            double distanceToEntity = traceStart.func_72438_d(entityRay.field_72307_f);

            if (distanceToEntity < trace.distance || trace.distance == 0.0D)
            {
                if (entity.func_184208_bv() == source.func_184208_bv())
                {
                    if (trace.distance == 0.0D)
                    {
                        trace.entity = entity;
                        trace.location = entityRay.field_72307_f;
                    }
                }
                else
                {
                    trace.entity = entity;
                    trace.location = entityRay.field_72307_f;
                    trace.distance = distanceToEntity;
                }
            }
        }
        
        return trace;
    }

    private static List<Entity> getTraceEntities(Entity source, double traceDistance, Vec3d dir, Predicate<Entity> filter)
    {
        AxisAlignedBB boundingBox = source.func_174813_aQ();
        AxisAlignedBB traceBox = boundingBox.func_72321_a(dir.field_72450_a, dir.field_72448_b, dir.field_72449_c);
        List<Entity> entities = source.field_70170_p.func_175674_a(source, traceBox.func_72321_a(1.0F, 1.0F, 1.0F), filter);
        return entities;
    }
    
    public static RayTraceResult rayTraceFromEntity(Entity source, double traceDistance, float partialTicks)
    {
        Vec3d traceStart = EntityUtilities.getPositionEyes(source, partialTicks);
        Vec3d lookDir = source.func_70676_i(partialTicks).func_186678_a(traceDistance);
        Vec3d traceEnd = traceStart.func_178787_e(lookDir);
        return source.field_70170_p.func_147447_a(traceStart, traceEnd, false, false, true);
    }

    public static Vec3d getPositionEyes(Entity entity, float partialTicks)
    {
        if (partialTicks == 1.0F)
        {
            return new Vec3d(entity.field_70165_t, entity.field_70163_u + entity.func_70047_e(), entity.field_70161_v);
        }

        double interpX = entity.field_70169_q + (entity.field_70165_t - entity.field_70169_q) * partialTicks;
        double interpY = entity.field_70167_r + (entity.field_70163_u - entity.field_70167_r) * partialTicks + entity.func_70047_e();
        double interpZ = entity.field_70166_s + (entity.field_70161_v - entity.field_70166_s) * partialTicks;
        return new Vec3d(interpX, interpY, interpZ);
    }
}
