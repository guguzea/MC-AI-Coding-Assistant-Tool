/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.mixin;

import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;

import net.minecraft.client.ClientBrandRetriever;

@Mixin(value = ClientBrandRetriever.class, remap = false)
public abstract class MixinClientBrandRetriever
{
    private static final String BRANDING_VANILLA = "vanilla";
    private static final String BRANDING_LITELOADER = "LiteLoader";

    @Inject(method = "getClientModName", at = @At("RETURN"), cancellable = true)
    private static void appendLiteLoaderBranding(CallbackInfoReturnable<String> cir)
    {
        String branding = cir.getReturnValue();
        if (MixinClientBrandRetriever.BRANDING_VANILLA.equals(branding))
        {
            // If the branding is vanilla, just overwrite it 
            cir.setReturnValue(MixinClientBrandRetriever.BRANDING_LITELOADER);
        }
        else
        {
            // Otherwise append it
            cir.setReturnValue(branding + "," + MixinClientBrandRetriever.BRANDING_LITELOADER);
        }
    }
}
