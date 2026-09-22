# FMLClientHandler

**Inheritance:** java.lang.Object → net.minecraftforge.fml.client.FMLClientHandler

## Class signature

```java
public class FMLClientHandler extends java.lang.Object implements IFMLSidedHandler
```

## Constructors

- `FMLClientHandler()`

## Methods

- `void addModAsResource(ModContainer container)`
- `void addSpecialModEntries(java.util.ArrayList<ModContainer> mods)`
- `void allowLogins()`
- `void beginMinecraftLoading(Minecraft minecraft, java.util.List<IResourcePack> resourcePackList, IReloadableResourceManager resourceManager)` — Called to start the whole game off
- `void beginServerLoading(MinecraftServer server)`
- `void bindServerListData(ServerData data, ServerStatusResponse originalResponse)`
- `void captureAdditionalData(ServerStatusResponse serverstatusresponse, com.google.gson.JsonObject jsonobject)`
- `void connectToRealmsServer(java.lang.String host, int port)`
- `void connectToServer(GuiScreen guiMultiplayer, ServerData serverEntry)`
- `void connectToServerAtStartup(java.lang.String host, int port)`
- `void displayGuiScreen(EntityPlayer player, GuiScreen gui)`
- `void displayMissingMods(java.lang.Object modMissingPacket)`
- `java.lang.String enhanceServerListEntry(ServerListEntryNormal serverListEntry, ServerData serverEntry, int x, int width, int y, int relativeMouseX, int relativeMouseY)`
- `void extendModList()`
- `void finishMinecraftLoading()` — Called a bit later on during initialization to finish loading mods Also initializes key bindings
- `void finishServerLoading()`
- `void fireNetRegistrationEvent(EventBus bus, NetworkManager manager, java.util.Set<java.lang.String> channelSet, java.lang.String channel, Side side)`
- `void fireSidedRegistryEvents()`
- `java.lang.String fixDescription(java.lang.String description)`
- `java.util.List<java.lang.String> getAdditionalBrandingInformation()`
- `Minecraft getClient()` — Get the server instance
- `EntityPlayerSP getClientPlayerEntity()`
- `INetHandler getClientPlayHandler()`
- `NetworkManager getClientToServerNetworkManager()`
- `java.lang.String getCurrentLanguage()`
- `IModGuiFactory getGuiFactoryFor(ModContainer selectedMod)`
- `IResourcePack getResourcePackFor(java.lang.String modId)`
- `java.io.File getSavesDir()`
- `java.io.File getSavesDirectory()`
- `MinecraftServer getServer()`
- `Side getSide()`
- `WorldClient getWorldClient()`
- `IThreadListener getWorldThread(INetHandler net)`
- `void haltGame(java.lang.String message, java.lang.Throwable t)`
- `void handleClientWorldClosing(WorldClient world)`
- `boolean handleLoadingScreen(ScaledResolution scaledResolution)`
- `boolean hasOptifine()`
- `static FMLClientHandler instance()`
- `boolean isDisplayVSyncForced()`
- `boolean isGUIOpen(java.lang.Class<? extends GuiScreen> gui)` — Is this GUI type open?
- `boolean isLoading()` — If the client is in the midst of loading, we disable saving so that custom settings aren't wiped out
- `void logMissingTextureErrors()`
- `void onInitializationComplete()`
- `void processWindowMessages()`
- `void queryUser(StartupQuery query)`
- `void reloadRenderers()`
- `void serverStopped()`
- `void setPlayClient(NetHandlerPlayClient netHandlerPlayClient)`
- `void setupServerList()`
- `boolean shouldAllowPlayerLogins()`
- `boolean shouldServerShouldBeKilledQuietly()`
- `void showGuiScreen(java.lang.Object clientGuiElement)`
- `void showInGameModOptions(GuiIngameMenu guiIngameMenu)`
- `void startIntegratedServer(java.lang.String id, java.lang.String name, WorldSettings settings)`
- `java.lang.String stripSpecialChars(java.lang.String message)`
- `void trackBrokenTexture(ResourceLocation resourceLocation, java.lang.String error)`
- `void trackMissingTexture(ResourceLocation resourceLocation)`
- `void tryLoadExistingWorld(GuiWorldSelection selectWorldGUI, WorldSummary comparator)`