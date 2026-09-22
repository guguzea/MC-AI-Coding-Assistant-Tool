---
title: "FMLClientHandler"
description: "public class FMLClientHandler extends java.lang.Object implements IFMLSidedHandler"
package: "cpw/mods/fml/client"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/client/FMLClientHandler.html"
sourceType: javadoc
---

# FMLClientHandler

**Inheritance:** java.lang.Object → cpw.mods.fml.client.FMLClientHandler

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
- `void beginMinecraftLoading(Minecraft minecraft, java.util.List resourcePackList, IReloadableResourceManager resourceManager)` — Called to start the whole game off
- `void beginServerLoading(MinecraftServer server)`
- `void bindServerListData(ServerData data, ServerStatusResponse originalResponse)`
- `void captureAdditionalData(ServerStatusResponse serverstatusresponse, JsonObject jsonobject)`
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
- `java.lang.String fixDescription(java.lang.String description)`
- `java.util.List<java.lang.String> getAdditionalBrandingInformation()`
- `Minecraft getClient()` — Get the server instance
- `EntityClientPlayerMP getClientPlayerEntity()`
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
- `void haltGame(java.lang.String message, java.lang.Throwable t)`
- `void handleClientWorldClosing(WorldClient world)`
- `boolean handleLoadingScreen(ScaledResolution scaledResolution)`
- `boolean hasOptifine()`
- `static FMLClientHandler instance()`
- `boolean isGUIOpen(java.lang.Class<? extends GuiScreen> gui)` — Is this GUI type open?
- `boolean isLoading()` — If the client is in the midst of loading, we disable saving so that custom settings aren't wiped out
- `void logMissingTextureErrors()`
- `void onInitializationComplete()`
- `void processWindowMessages()`
- `void queryUser(StartupQuery query)`
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
- `void tryLoadExistingWorld(GuiSelectWorld selectWorldGUI, java.lang.String dirName, java.lang.String saveName)`
- `void waitForPlayClient()`
