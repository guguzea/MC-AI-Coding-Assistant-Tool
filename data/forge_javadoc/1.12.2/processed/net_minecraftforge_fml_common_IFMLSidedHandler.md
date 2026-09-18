# IFMLSidedHandler

## Class signature

```java
public interface IFMLSidedHandler
```

## Methods

- `java.util.List<java.lang.String> getAdditionalBrandingInformation()`
- `Side getSide()`
- `void haltGame(java.lang.String message, java.lang.Throwable exception)`
- `void showGuiScreen(java.lang.Object clientGuiElement)`
- `void queryUser( StartupQuery query) throws java.lang.InterruptedException`
- `void beginServerLoading( MinecraftServer server)`
- `void finishServerLoading()`
- `java.io.File getSavesDirectory()`
- `MinecraftServer getServer()`
- `boolean isDisplayCloseRequested()`
- `boolean shouldServerShouldBeKilledQuietly()`
- `void addModAsResource( ModContainer container)`
- `java.lang.String getCurrentLanguage()`
- `void serverStopped()`
- `NetworkManager getClientToServerNetworkManager()`
- `INetHandler getClientPlayHandler()`
- `void fireNetRegistrationEvent( EventBus bus, NetworkManager manager, java.util.Set<java.lang.String> channelSet, java.lang.String channel, Side side)`
- `boolean shouldAllowPlayerLogins()`
- `void allowLogins()`
- `IThreadListener getWorldThread( INetHandler net)`
- `void processWindowMessages()`
- `java.lang.String stripSpecialChars(java.lang.String message)`
- `void reloadRenderers()`
- `void fireSidedRegistryEvents()`
- `CompoundDataFixer getDataFixer()`
- `boolean isDisplayVSyncForced()`
- `default void resetClientRecipeBook()`
- `default void reloadSearchTrees()`
- `default void reloadCreativeSettings()`