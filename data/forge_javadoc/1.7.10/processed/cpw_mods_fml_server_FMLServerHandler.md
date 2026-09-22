# FMLServerHandler

**Inheritance:** java.lang.Object → cpw.mods.fml.server.FMLServerHandler

## Class signature

```java
public class FMLServerHandler extends java.lang.Object implements IFMLSidedHandler
```

## Methods

- `void addModAsResource(ModContainer container)`
- `void allowLogins()`
- `void beginServerLoading(MinecraftServer minecraftServer)` — Called to start the whole game off from MinecraftServer.startServer()
- `void finishServerLoading()` — Called a bit later on during server initialization to finish loading mods
- `void fireNetRegistrationEvent(EventBus bus, NetworkManager manager, java.util.Set<java.lang.String> channelSet, java.lang.String channel, Side side)`
- `java.util.List<java.lang.String> getAdditionalBrandingInformation()`
- `INetHandler getClientPlayHandler()`
- `NetworkManager getClientToServerNetworkManager()`
- `java.lang.String getCurrentLanguage()`
- `java.io.File getSavesDirectory()`
- `MinecraftServer getServer()` — Get the server instance
- `Side getSide()`
- `void haltGame(java.lang.String message, java.lang.Throwable exception)`
- `static FMLServerHandler instance()`
- `void processWindowMessages()`
- `void queryUser(StartupQuery query)`
- `void serverStopped()`
- `boolean shouldAllowPlayerLogins()`
- `boolean shouldServerShouldBeKilledQuietly()`
- `void showGuiScreen(java.lang.Object clientGuiElement)`
- `java.lang.String stripSpecialChars(java.lang.String message)`
- `void waitForPlayClient()`