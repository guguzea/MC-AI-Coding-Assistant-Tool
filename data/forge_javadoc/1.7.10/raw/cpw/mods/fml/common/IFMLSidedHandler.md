---
title: "IFMLSidedHandler"
description: "public interface IFMLSidedHandler"
package: "cpw/mods/fml/common"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/IFMLSidedHandler.html"
sourceType: javadoc
---

# IFMLSidedHandler

## Class signature

```java
public interface IFMLSidedHandler
```

## Methods

- `void addModAsResource(ModContainer container)`
- `void allowLogins()`
- `void beginServerLoading(MinecraftServer server)`
- `void finishServerLoading()`
- `void fireNetRegistrationEvent(EventBus bus, NetworkManager manager, java.util.Set<java.lang.String> channelSet, java.lang.String channel, Side side)`
- `java.util.List<java.lang.String> getAdditionalBrandingInformation()`
- `INetHandler getClientPlayHandler()`
- `NetworkManager getClientToServerNetworkManager()`
- `java.lang.String getCurrentLanguage()`
- `java.io.File getSavesDirectory()`
- `MinecraftServer getServer()`
- `Side getSide()`
- `void haltGame(java.lang.String message, java.lang.Throwable exception)`
- `void processWindowMessages()`
- `void queryUser(StartupQuery query)`
- `void serverStopped()`
- `boolean shouldAllowPlayerLogins()`
- `boolean shouldServerShouldBeKilledQuietly()`
- `void showGuiScreen(java.lang.Object clientGuiElement)`
- `java.lang.String stripSpecialChars(java.lang.String message)`
- `void waitForPlayClient()`
