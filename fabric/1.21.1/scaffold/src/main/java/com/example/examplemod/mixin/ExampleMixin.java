package com.example.examplemod.mixin;

import net.minecraft.server.MinecraftServer;
import net.minecraft.server.world.ServerWorld;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;

/**
 * Example Mixin that modifies server-side behavior.
 *
 * Note: This mixin is configured in examplemod.mixins.json to be applied on the server side.
 */
@Mixin(MinecraftServer.class)
public class ExampleMixin {

    /**
     * Injects into the tick method of MinecraftServer.
     * This allows you to run code every server tick.
     */
    @Inject(at = @At("HEAD"), method = "tickWorlds")
    private void onTickWorlds(CallbackInfoReturnable<Integer> cir) {
        // This code will run every server tick
        // Example: MinecraftServer server = (MinecraftServer) (Object) this;
        // Example: for (ServerWorld world : server.getWorlds()) { ... }
    }
}
