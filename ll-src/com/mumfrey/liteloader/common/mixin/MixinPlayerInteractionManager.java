/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.common.mixin;

import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;

import com.mumfrey.liteloader.core.LiteLoaderEventBroker;
import com.mumfrey.liteloader.core.LiteLoaderEventBroker.InteractType;

import net.minecraft.entity.player.EntityPlayer;
import net.minecraft.entity.player.EntityPlayerMP;
import net.minecraft.item.ItemStack;
import net.minecraft.server.management.PlayerInteractionManager;
import net.minecraft.util.EnumActionResult;
import net.minecraft.util.EnumFacing;
import net.minecraft.util.EnumHand;
import net.minecraft.util.math.BlockPos;
import net.minecraft.world.World;

@Mixin(value = PlayerInteractionManager.class, priority = 2000)
public abstract class MixinPlayerInteractionManager
{
    LiteLoaderEventBroker<?, ?> broker = LiteLoaderEventBroker.getCommonBroker();

    @Inject(
        method = "onBlockClicked(Lnet/minecraft/util/math/BlockPos;Lnet/minecraft/util/EnumFacing;)V",
        cancellable = true,
        at = @At("HEAD")
    )
    private void onBlockClicked(BlockPos pos, EnumFacing side, CallbackInfo ci)
    {
        if (!this.broker.onBlockClicked(pos, side, (PlayerInteractionManager)(Object)this))
        {
            ci.cancel();
        }
    }
    
    @Inject(
        method = "processRightClickBlock(Lnet/minecraft/entity/player/EntityPlayer;Lnet/minecraft/world/World;Lnet/minecraft/item/ItemStack;"
                + "Lnet/minecraft/util/EnumHand;Lnet/minecraft/util/math/BlockPos;Lnet/minecraft/util/EnumFacing;FFF)"
                + "Lnet/minecraft/util/EnumActionResult;",
        cancellable = true,
        at = @At("HEAD")
    )
    private void onRightClickBlock(EntityPlayer player, World worldIn, ItemStack stack, EnumHand hand, BlockPos pos, EnumFacing side,
            float offsetX, float offsetY, float offsetZ, CallbackInfoReturnable<EnumActionResult> cir)
    {
        if (!(player instanceof EntityPlayerMP))
        {
            return;
        }

        if (!this.broker.onUseItem((EntityPlayerMP)player, hand, stack, pos, side))
        {
            cir.setReturnValue(EnumActionResult.FAIL);
        }
    }
    
//    @Inject(
//            method = "processRightClickBlock(Lnet/minecraft/entity/player/EntityPlayer;Lnet/minecraft/world/World;Lnet/minecraft/item/ItemStack;"
//                    + "Lnet/minecraft/util/EnumHand;Lnet/minecraft/util/math/BlockPos;Lnet/minecraft/util/EnumFacing;FFF)"
//                    + "Lnet/minecraft/util/EnumActionResult;",
//                    cancellable = true,
//                    at = @At("RETURN")
//            )
//    private void postRightClickBlock(EntityPlayer player, World worldIn, ItemStack stack, EnumHand hand, BlockPos pos, EnumFacing side,
//            float offsetX, float offsetY, float offsetZ, CallbackInfoReturnable<EnumActionResult> cir)
//    {
//        if (!(player instanceof EntityPlayerMP))
//        {
//            return;
//        }
//        
//        System.err.printf("@@ postRightClickBlock: %s\n", cir.getReturnValue());
//    }
    
    @Inject(
            method = "processRightClick(Lnet/minecraft/entity/player/EntityPlayer;Lnet/minecraft/world/World;Lnet/minecraft/item/ItemStack;"
                    + "Lnet/minecraft/util/EnumHand;)Lnet/minecraft/util/EnumActionResult;",
                    cancellable = true,
                    at = @At("HEAD")
            )
    private void onRightClick(EntityPlayer player, World worldIn, ItemStack stack, EnumHand hand, CallbackInfoReturnable<EnumActionResult> cir)
    {
        if (!(player instanceof EntityPlayerMP))
        {
            return;
        }

        if (!this.broker.onClickedAir(InteractType.RIGHT_CLICK, (EntityPlayerMP)player, hand))
        {
            cir.setReturnValue(EnumActionResult.FAIL);
        }
    }
}
