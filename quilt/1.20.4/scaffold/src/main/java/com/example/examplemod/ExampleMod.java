package com.example.examplemod;

import org.quiltmc.loader.api.ModContainer;
import org.quiltmc.loader.api.entrypoint.ModInitializer;

public class ExampleMod implements ModInitializer {
    @Override
    public void onInitialize(ModContainer mod) {
        // 简单注册用 Vanilla Registry.register；不要调用 Fabric RegistrySync
    }
}
