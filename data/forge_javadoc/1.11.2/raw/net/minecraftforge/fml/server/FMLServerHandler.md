---
title: "FMLServerHandler"
description: "public class FMLServerHandler extends java.lang.Object implements IFMLSidedHandler"
package: "net/minecraftforge/fml/server"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/server/FMLServerHandler.html"
sourceType: javadoc
---

# FMLServerHandler

**Inheritance:** java.lang.Object → net.minecraftforge.fml.server.FMLServerHandler

## Class signature

```java
public class FMLServerHandler extends java.lang.Object implements IFMLSidedHandler
```

## Methods

- `void addModAsResource(ModContainer container)`
- `void allowLogins()`
- `void beginServerLoading(MinecraftServer minecraftServer)` — Called to start the whole game off from MinecraftServer#startServer
- `void finishServerLoading()` — Called a bit later on during server initialization to finish loading mods
- `void fireNetRegistrationEvent(EventBus bus, NetworkManager manager, java.util.Set<java.lang.String> channelSet, java.lang.String channel, Side side)`
- `void fireSidedRegistryEvents()`
- `java.util.List<java.lang.String> getAdditionalBrandingInformation()`
- `INetHandler getClientPlayHandler()`
- `NetworkManager getClientToServerNetworkManager()`
- `java.lang.String getCurrentLanguage()`
- `CompoundDataFixer getDataFixer()`
- `java.io.File getSavesDirectory()`
- `MinecraftServer getServer()` — Get the server instance
- `Side getSide()`
- `IThreadListener getWorldThread(INetHandler net)`
- `void haltGame(java.lang.String message, java.lang.Throwable exception)`
- `static FMLServerHandler instance()`
- `void processWindowMessages()`
- `void queryUser(StartupQuery query)`
- `void reloadRenderers()`
- `void serverStopped()`
- `boolean shouldAllowPlayerLogins()`
- `boolean shouldServerShouldBeKilledQuietly()`
- `void showGuiScreen(java.lang.Object clientGuiElement)`
- `java.lang.String stripSpecialChars(java.lang.String message)`
