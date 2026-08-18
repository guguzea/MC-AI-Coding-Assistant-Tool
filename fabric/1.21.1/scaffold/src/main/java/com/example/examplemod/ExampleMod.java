package com.example.examplemod;

import net.fabricmc.api.ModInitializer;
import net.minecraft.item.Item;
import net.minecraft.registry.Registries;
import net.minecraft.registry.Registry;
import net.minecraft.util.Identifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ExampleMod implements ModInitializer {
    public static final String MOD_ID = "examplemod";
    public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);

    public static final Item MY_ITEM = Registry.register(
        Registries.ITEM,
        Identifier.of(MOD_ID, "my_item"),
        new Item(new Item.Settings())
    );

    @Override
    public void onInitialize() {
        LOGGER.info("ExampleMod initialized for Minecraft 1.21.1");
    }
}
