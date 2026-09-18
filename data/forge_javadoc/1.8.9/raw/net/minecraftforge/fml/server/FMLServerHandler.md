---
title: "FMLServerHandler"
description: "Handles primary communication from hooked code into the system The FML entry point is beginServerLoading(MinecraftServer) called from DedicatedServer Obfuscated code should focus on this class and oth"
package: "net/minecraftforge/fml/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/server/FMLServerHandler.html"
sourceType: javadoc
---

# FMLServerHandler

## Class signature

```java
public class FMLServerHandler extends java.lang.Object implements IFMLSidedHandler
```

## Methods

- `public void beginServerLoading( MinecraftServer minecraftServer)`
- `public void finishServerLoading()`
- `public void haltGame(java.lang.String message, java.lang.Throwable exception)`
- `public java.io.File getSavesDirectory()`
- `public MinecraftServer getServer()`
- `public static FMLServerHandler instance()`
- `public java.util.List<java.lang.String> getAdditionalBrandingInformation()`
- `public Side getSide()`
- `public void showGuiScreen(java.lang.Object clientGuiElement)`
- `public void queryUser( StartupQuery query) throws java.lang.InterruptedException`
- `public boolean shouldServerShouldBeKilledQuietly()`
- `public void addModAsResource( ModContainer container)`
- `public java.lang.String getCurrentLanguage()`
- `public void serverStopped()`
- `public NetworkManager getClientToServerNetworkManager()`
- `public INetHandler getClientPlayHandler()`
- `public void fireNetRegistrationEvent( EventBus bus, NetworkManager manager, java.util.Set<java.lang.String> channelSet, java.lang.String channel, Side side)`
- `public boolean shouldAllowPlayerLogins()`
- `public void allowLogins()`
- `public IThreadListener getWorldThread( INetHandler net)`
- `public void processWindowMessages()`
- `public java.lang.String stripSpecialChars(java.lang.String message)`

## Description

Handles primary communication from hooked code into the system The FML entry point is beginServerLoading(MinecraftServer) called from DedicatedServer Obfuscated code should focus on this class and oth
