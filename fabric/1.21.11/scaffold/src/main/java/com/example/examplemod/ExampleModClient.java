package com.example.examplemod;

import net.fabricmc.api.ClientModInitializer;

public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        // Client-only setup (rendering, keybinds). Keep Yarn names; do not copy Mojmap from 26.1.2.
    }
}
