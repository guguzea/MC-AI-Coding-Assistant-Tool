---
title: "IFMLSidedHandler"
description: "public interface IFMLSidedHandler"
package: "net/minecraftforge/fml/common"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/IFMLSidedHandler.html"
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
- `void fireSidedRegistryEvents()`
- `java.util.List<java.lang.String> getAdditionalBrandingInformation()`
- `INetHandler getClientPlayHandler()`
- `NetworkManager getClientToServerNetworkManager()`
- `java.lang.String getCurrentLanguage()`
- `CompoundDataFixer getDataFixer()`
- `java.io.File getSavesDirectory()`
- `MinecraftServer getServer()`
- `Side getSide()`
- `IThreadListener getWorldThread(INetHandler net)`
- `void haltGame(java.lang.String message, java.lang.Throwable exception)`
- `boolean isDisplayCloseRequested()`
- `boolean isDisplayVSyncForced()`
- `void processWindowMessages()`
- `void queryUser(StartupQuery query)`
- `default void reloadCreativeSettings()`
- `void reloadRenderers()`
- `default void reloadSearchTrees()`
- `default void resetClientRecipeBook()`
- `void serverStopped()`
- `boolean shouldAllowPlayerLogins()`
- `boolean shouldServerShouldBeKilledQuietly()`
- `void showGuiScreen(java.lang.Object clientGuiElement)`
- `java.lang.String stripSpecialChars(java.lang.String message)`
