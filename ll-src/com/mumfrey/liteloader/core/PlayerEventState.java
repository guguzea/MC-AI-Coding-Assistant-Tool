/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.core;

import java.lang.ref.WeakReference;

import com.mumfrey.liteloader.PlayerInteractionListener.MouseButton;
import com.mumfrey.liteloader.core.LiteLoaderEventBroker.InteractType;
import com.mumfrey.liteloader.util.EntityUtilities;

import net.minecraft.entity.player.EntityPlayerMP;
import net.minecraft.item.ItemStack;
import net.minecraft.server.MinecraftServer;
import net.minecraft.util.EnumFacing;
import net.minecraft.util.EnumHand;
import net.minecraft.util.math.BlockPos;
import net.minecraft.util.math.RayTraceResult;
import net.minecraft.util.math.RayTraceResult.Type;

public class PlayerEventState implements IEventState
{
    private static long MISS = new BlockPos(-1, -1, -1).func_177986_g();

    private WeakReference<EntityPlayerMP> playerRef;

    private final LiteLoaderEventBroker<?, ?> broker;

    private double traceDistance = 256.0;

    private int suppressLeftTicks; 
    private int suppressRightTicks; 
    private boolean leftClick;
    private boolean rightClick;
    private boolean digging;
    
    private EnumHand hand = EnumHand.MAIN_HAND;

    private RayTraceResult hit;

    private String locale = "en_US";

    public PlayerEventState(EntityPlayerMP player, LiteLoaderEventBroker<?, ?> broker)
    {
        this.playerRef = new WeakReference<EntityPlayerMP>(player);
        this.broker = broker;
    }

    public void setTraceDistance(int renderDistance)
    {
        this.traceDistance = renderDistance * 16.0;
    }

    public double getTraceDistance()
    {
        return this.traceDistance;
    }

    public void setLocale(String lang)
    {
        if (lang.matches("^[a-z]{2}_[A-Z]{2}$"))
        {
            this.locale = lang;
        }
    }

    public String getLocale()
    {
        return this.locale;
    }

    public EntityPlayerMP getPlayer()
    {
        return this.playerRef.get();
    }

    public void onSpawned()
    {
    }

    @Override
    public void onTick(MinecraftServer server)
    {
        if (this.leftClick && this.suppressLeftTicks == 0 && !this.digging)
        {
            this.broker.onPlayerClickedAir(this.getPlayer(), MouseButton.LEFT, this.hand,
                    this.hit.func_178782_a(), this.hit.field_178784_b, this.hit.field_72313_a);
        }

        if (this.rightClick && this.suppressRightTicks == 0)
        {
            this.broker.onPlayerClickedAir(this.getPlayer(), MouseButton.RIGHT, this.hand,
                    this.hit.func_178782_a(), this.hit.field_178784_b,  this.hit.field_72313_a);
        }

        if (this.suppressLeftTicks > 0) this.suppressLeftTicks--;
        if (this.suppressRightTicks > 0) this.suppressRightTicks--;

        this.leftClick = false;
        this.rightClick = false;
    }

    public boolean onPlayerInteract(InteractType action, EntityPlayerMP player, EnumHand hand, ItemStack stack, BlockPos position, EnumFacing side)
    {
        if (action == InteractType.DIG_BLOCK_MAYBE && !player.func_184812_l_())
        {
            this.digging = true;
        }
        
        if (action == InteractType.DIG_BLOCK_END)
        {
            this.digging = false;
            this.suppressLeftTicks++;
            return true;
        }
        
        this.hit = EntityUtilities.rayTraceFromEntity(player, this.traceDistance, 0.0F);

        if (action == InteractType.LEFT_CLICK)
        {
            this.leftClick = true;
            this.hand = hand;
            return true;
        }

        if (action == InteractType.RIGHT_CLICK)
        {
            this.digging = false;
            this.hand = hand;
            this.rightClick = true;
            return true;
        }

        if ((action == InteractType.LEFT_CLICK_BLOCK || action == InteractType.DIG_BLOCK_MAYBE) && this.suppressLeftTicks == 0)
        {
            this.suppressLeftTicks += 2;
            return this.broker.onPlayerClickedBlock(player, MouseButton.LEFT, hand, stack, position, side);
        }

        if (action == InteractType.PLACE_BLOCK_MAYBE)
        {
            this.digging = false;

            if (this.suppressRightTicks > 0 && (this.suppressRightTicks != 1 && hand != this.hand))
            {
                return true;
            }

            if (position.func_177986_g() == PlayerEventState.MISS)
            {
                RayTraceResult actualHit = EntityUtilities.rayTraceFromEntity(player, player.field_71075_bZ.field_75098_d ? 5.0 : 4.5, 0.0F);
                if (actualHit.field_72313_a == Type.MISS)
                {
                    this.digging = false;
                    this.hand = hand;
                    this.rightClick = true;
                    return true;
                }
            }

            this.hand = hand;
            this.suppressRightTicks++;
            this.suppressLeftTicks++;
            return this.broker.onPlayerClickedBlock(player, MouseButton.RIGHT, hand, stack, position, side);
        }

        return true;
    }
}
