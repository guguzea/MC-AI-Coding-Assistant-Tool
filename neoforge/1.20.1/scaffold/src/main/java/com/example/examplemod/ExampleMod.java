package com.example.examplemod;

import net.neoforged.bus.api.IEventBus;
import net.neoforged.fml.common.Mod;

@Mod("examplemod")
public class ExampleMod {
    public ExampleMod(IEventBus modEventBus) {
        // DeferredRegister 挂 IEventBus：search_neoforge_docs query=registries version=1.20.1
        // 以该版文档为准，禁止默写 DeferredBlock / RegisterPayloadHandlersEvent
    }
}
