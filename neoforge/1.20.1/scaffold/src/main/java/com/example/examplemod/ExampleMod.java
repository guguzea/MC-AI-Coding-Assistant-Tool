package com.example.examplemod;

import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.loading.FMLJavaModLoadingContext;

@Mod("examplemod")
public class ExampleMod {
    public ExampleMod() {
        IEventBus modEventBus = FMLJavaModLoadingContext.get().getModEventBus();
        // DeferredRegister 挂 IEventBus：search_neoforge_docs query=registries version=1.20.1
        // 以该版文档为准，禁止默写 DeferredBlock / RegisterPayloadHandlersEvent
    }
}
