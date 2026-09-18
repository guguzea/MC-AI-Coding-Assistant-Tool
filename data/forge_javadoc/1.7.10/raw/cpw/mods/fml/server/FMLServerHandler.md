---
title: "FMLServerHandler"
description: "Handles primary communication from hooked code into the system The FML entry point is beginServerLoading(MinecraftServer) called from DedicatedServer Obfuscated code should focus on this class and oth"
package: "cpw/mods/fml/server"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/server/FMLServerHandler.html"
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
- `public void waitForPlayClient()`
- `public void fireNetRegistrationEvent( EventBus bus, NetworkManager manager, java.util.Set<java.lang.String> channelSet, java.lang.String channel, Side side)`
- `public boolean shouldAllowPlayerLogins()`
- `public void allowLogins()`
- `public void processWindowMessages()`
- `public java.lang.String stripSpecialChars(java.lang.String message)`

## Description

Handles primary communication from hooked code into the system The FML entry point is beginServerLoading(MinecraftServer) called from DedicatedServer Obfuscated code should focus on this class and oth
