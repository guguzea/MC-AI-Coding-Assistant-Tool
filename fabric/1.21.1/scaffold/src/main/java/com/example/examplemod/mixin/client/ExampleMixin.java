package com.example.examplemod.mixin.client;

import net.minecraft.client.MinecraftClient;
import net.minecraft.client.world.ClientWorld;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

/**
 * Example Mixin that modifies client-side behavior.
 *
 * Note: This mixin is configured in examplemod.mixins.json to be applied on the client side only.
 */
@Mixin(MinecraftClient.class)
public class ExampleMixin {

    /**
     * Injects into the tick method of MinecraftClient.
     * This allows you to run code every client tick.
     */
    @Inject(at = @At("HEAD"), method = "tick")
    private void onTick(CallbackInfo ci) {
        // This code will run every client tick
        // Example: MinecraftClient client = (MinecraftClient) (Object) this;
        // Example: if (client.player != null) { ... }
    }
}
