package com.example.examplemod;

import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.common.Mod.EventHandler;
import net.minecraftforge.fml.common.SidedProxy;
import net.minecraftforge.fml.common.event.FMLInitializationEvent;
import net.minecraftforge.fml.common.event.FMLPostInitializationEvent;
import net.minecraftforge.fml.common.event.FMLPreInitializationEvent;
import net.minecraftforge.fml.common.registry.GameRegistry;
import org.apache.logging.log4j.Logger;

@Mod(modid = ExampleMod.MOD_ID, name = ExampleMod.NAME, version = ExampleMod.VERSION)
public class ExampleMod {

    public static final String MOD_ID = "examplemod";
    public static final String NAME = "Example Mod";
    public static final String VERSION = "1.0.0";

    private static Logger logger;

    @SidedProxy(
        clientSide = "com.example.examplemod.client.ClientProxy",
        serverSide = "com.example.examplemod.CommonProxy"
    )
    public static CommonProxy proxy;

    @EventHandler
    public void preInit(FMLPreInitializationEvent event) {
        logger = event.getModLog();
        logger.info("ExampleMod preInit");
        proxy.preInit(event);
    }

    @EventHandler
    public void init(FMLInitializationEvent event) {
        logger.info("ExampleMod init");
        proxy.init(event);
    }

    @EventHandler
    public void postInit(FMLPostInitializationEvent event) {
        logger.info("ExampleMod postInit");
        proxy.postInit(event);
    }
}
