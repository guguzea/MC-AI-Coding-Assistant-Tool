/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.common.mixin;

import org.objectweb.asm.Opcodes;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Shadow;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.At.Shift;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;
import org.spongepowered.asm.mixin.injection.callback.LocalCapture;

import com.mumfrey.liteloader.common.ducks.ITeleportHandler;
import com.mumfrey.liteloader.core.LiteLoaderEventBroker;
import com.mumfrey.liteloader.core.LiteLoaderEventBroker.InteractType;

import net.minecraft.entity.player.EntityPlayerMP;
import net.minecraft.network.NetHandlerPlayServer;
import net.minecraft.network.play.client.CPacketAnimation;
import net.minecraft.network.play.client.CPacketPlayer;
import net.minecraft.network.play.client.CPacketPlayerDigging;
import net.minecraft.network.play.client.CPacketPlayerDigging.Action;
import net.minecraft.network.play.client.CPacketPlayerTryUseItem;
import net.minecraft.util.math.Vec3d;
import net.minecraft.world.WorldServer;

@Mixin(NetHandlerPlayServer.class)
public abstract class MixinNetHandlerPlayServer implements ITeleportHandler
{
    @Shadow private int teleportId;
    @Shadow private Vec3d targetPos;
    @Shadow public EntityPlayerMP player;
    
    LiteLoaderEventBroker<?, ?> broker = LiteLoaderEventBroker.getCommonBroker();
    
    @Inject(
        method = "processTryUseItem(Lnet/minecraft/network/play/client/CPacketPlayerTryUseItem;)V",
        cancellable = true,
        at = @At(
            value = "INVOKE",
            shift = Shift.AFTER,
            target = "Lnet/minecraft/network/PacketThreadUtil;checkThreadAndEnqueue"
                    + "(Lnet/minecraft/network/Packet;Lnet/minecraft/network/INetHandler;Lnet/minecraft/util/IThreadListener;)V"
        )
    )
    private void onPlaceBlock(CPacketPlayerTryUseItem packetIn, CallbackInfo ci)
    {
//        this.onPlaceBlock(ci, (NetHandlerPlayServer)(Object)this, packetIn);
    }
    
    @Inject(
        method = "handleAnimation(Lnet/minecraft/network/play/client/CPacketAnimation;)V",
        cancellable = true,
        at = @At(
            value = "INVOKE",
            shift = Shift.AFTER,
            target = "Lnet/minecraft/network/PacketThreadUtil;checkThreadAndEnqueue"
                    + "(Lnet/minecraft/network/Packet;Lnet/minecraft/network/INetHandler;Lnet/minecraft/util/IThreadListener;)V"
        )
    )
    private void onClickedAir(CPacketAnimation packetIn, CallbackInfo ci)
    {
        if (!this.broker.onClickedAir(InteractType.LEFT_CLICK, ((NetHandlerPlayServer)(Object)this).field_147369_b, packetIn.func_187018_a()))
        {
            ci.cancel();
        }
    }
    
    @Inject(
        method = "processPlayerDigging(Lnet/minecraft/network/play/client/CPacketPlayerDigging;)V",
        cancellable = true,
        at = @At(
            value = "INVOKE",
            shift = Shift.AFTER,
            target = "Lnet/minecraft/network/PacketThreadUtil;checkThreadAndEnqueue"
                    + "(Lnet/minecraft/network/Packet;Lnet/minecraft/network/INetHandler;Lnet/minecraft/util/IThreadListener;)V"
        )
    )
    private void onPlayerDigging(CPacketPlayerDigging packetIn, CallbackInfo ci)
    {
        NetHandlerPlayServer netHandler = (NetHandlerPlayServer)(Object)this;
        Action action = packetIn.func_180762_c();
        if (action == Action.START_DESTROY_BLOCK)
        {
            if (!this.broker.onPlayerDigging(InteractType.DIG_BLOCK_MAYBE, this.player, netHandler, packetIn.func_179715_a()))
            {
                ci.cancel();
            }
        }
        else if (action == Action.ABORT_DESTROY_BLOCK || action == Action.STOP_DESTROY_BLOCK)
        {
            this.broker.onPlayerDigging(InteractType.DIG_BLOCK_END, this.player, netHandler, packetIn.func_179715_a());
        }
        else if (action == Action.SWAP_HELD_ITEMS)
        {
            if (!this.broker.onPlayerSwapItems(this.player))
            {
                ci.cancel();
            }
        }
    }
    
    @Inject(
        method = "processPlayer(Lnet/minecraft/network/play/client/CPacketPlayer;)V",
        cancellable = true,
        locals = LocalCapture.CAPTURE_FAILHARD,
        at = @At(
            value = "FIELD",
            opcode = Opcodes.GETFIELD,
            target = "Lnet/minecraft/entity/player/EntityPlayerMP;posY:D",
            ordinal = 3
        )
    )
    private void onPlayerMoved(CPacketPlayer packetIn, CallbackInfo ci, WorldServer world)
    {
        if (!this.broker.onPlayerMove((NetHandlerPlayServer)(Object)this, packetIn, this.player, world))
        {
            ci.cancel();
        }
    }
    
    @Override
    public int beginTeleport(Vec3d location)
    {
        this.targetPos = location;

        if (++this.teleportId == Integer.MAX_VALUE)
        {
            this.teleportId = 0;
        }
        
        return this.teleportId;
    }
}
