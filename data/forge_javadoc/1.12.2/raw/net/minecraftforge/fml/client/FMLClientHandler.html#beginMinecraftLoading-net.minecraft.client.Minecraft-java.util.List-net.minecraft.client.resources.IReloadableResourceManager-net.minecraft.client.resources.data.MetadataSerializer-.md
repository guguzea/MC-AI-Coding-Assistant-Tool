---
title: "FMLClientHandler.html#beginMinecraftLoading-net.minecraft.client.Minecraft-java.util.List-net.minecraft.client.resources.IReloadableResourceManager-net.minecraft.client.resources.data.MetadataSerializer-"
description: "Handles primary communication from hooked code into the system The FML entry point is beginMinecraftLoading(Minecraft, List, IReloadableResourceManager, MetadataSerializer) called from Minecraft Obfus"
package: "net/minecraftforge/fml/client"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/client/FMLClientHandler.html#beginMinecraftLoading-net.minecraft.client.Minecraft-java.util.List-net.minecraft.client.resources.IReloadableResourceManager-net.minecraft.client.resources.data.MetadataSerializer-"
sourceType: javadoc
---

# FMLClientHandler.html#beginMinecraftLoading-net.minecraft.client.Minecraft-java.util.List-net.minecraft.client.resources.IReloadableResourceManager-net.minecraft.client.resources.data.MetadataSerializer-

## Class signature

```java
public class FMLClientHandler extends java.lang.Object implements IFMLSidedHandler
```

## Methods

- `public FMLClientHandler()`
- `public void beginMinecraftLoading( Minecraft minecraft, java.util.List< IResourcePack > resourcePackList, IReloadableResourceManager resourceManager, MetadataSerializer metaSerializer)`
- `public void haltGame(java.lang.String message, java.lang.Throwable t)`
- `public boolean hasError()`
- `public void finishMinecraftLoading()`
- `public void extendModList()`
- `public void onInitializationComplete()`
- `public Minecraft getClient()`
- `public static FMLClientHandler instance()`
- `public void displayGuiScreen( EntityPlayer player, GuiScreen gui)`
- `public void addSpecialModEntries(java.util.ArrayList< ModContainer > mods)`
- `public java.util.List<java.lang.String> getAdditionalBrandingInformation()`
- `public Side getSide()`
- `public boolean hasOptifine()`
- `public void showGuiScreen(java.lang.Object clientGuiElement)`
- `public void queryUser( StartupQuery query) throws java.lang.InterruptedException`
- `public boolean handleLoadingScreen( ScaledResolution scaledResolution) throws java.io.IOException`
- `public WorldClient getWorldClient()`
- `public EntityPlayerSP getClientPlayerEntity()`
- `public void beginServerLoading( MinecraftServer server)`
- `public void finishServerLoading()`
- `public java.io.File getSavesDirectory()`
- `public MinecraftServer getServer()`
- `@Deprecated public void displayMissingMods(java.lang.Object modMissingPacket)`
- `public boolean isLoading()`
- `public boolean isDisplayCloseRequested()`
- `public boolean shouldServerShouldBeKilledQuietly()`
- `public boolean isGUIOpen(java.lang.Class<? extends GuiScreen > gui)`
- `public void addModAsResource( ModContainer container)`
- `public IResourcePack getResourcePackFor(java.lang.String modId)`
- `public java.lang.String getCurrentLanguage()`
- `public void serverStopped()`
- `public INetHandler getClientPlayHandler()`
- `public NetworkManager getClientToServerNetworkManager()`
- `public void handleClientWorldClosing( WorldClient world)`
- `public void startIntegratedServer(java.lang.String id, java.lang.String name, WorldSettings settings)`
- `public java.io.File getSavesDir()`
- `public void tryLoadExistingWorld( GuiWorldSelection selectWorldGUI, WorldSummary comparator)`
- `public void showInGameModOptions( GuiIngameMenu guiIngameMenu)`
- `public IModGuiFactory getGuiFactoryFor( ModContainer selectedMod)`
- `public void setupServerList()`
- `public void captureAdditionalData( ServerStatusResponse serverstatusresponse, JsonObject jsonobject)`
- `public void bindServerListData( ServerData data, ServerStatusResponse originalResponse)`
- `public java.lang.String enhanceServerListEntry( ServerListEntryNormal serverListEntry, ServerData serverEntry, int x, int width, int y, int relativeMouseX, int relativeMouseY)`
- `public java.lang.String fixDescription(java.lang.String description)`
- `public void connectToServerAtStartup(java.lang.String host, int port)`
- `public void connectToServer( GuiScreen guiMultiplayer, ServerData serverEntry)`
- `public void connectToRealmsServer(java.lang.String host, int port)`
- `public void setPlayClient( NetHandlerPlayClient netHandlerPlayClient)`
- `public void fireNetRegistrationEvent( EventBus bus, NetworkManager manager, java.util.Set<java.lang.String> channelSet, java.lang.String channel, Side side)`
- `public boolean shouldAllowPlayerLogins()`
- `public void allowLogins()`
- `public IThreadListener getWorldThread( INetHandler net)`
- `public void trackMissingTexture( ResourceLocation resourceLocation)`
- `public void trackBrokenTexture( ResourceLocation resourceLocation, java.lang.String error)`
- `public void logMissingTextureErrors()`
- `public void processWindowMessages()`
- `public java.lang.String stripSpecialChars(java.lang.String message)`
- `public void reloadRenderers()`
- `public void fireSidedRegistryEvents()`
- `public CompoundDataFixer getDataFixer()`
- `public boolean isDisplayVSyncForced()`
- `public void resetClientRecipeBook()`
- `public void reloadSearchTrees()`
- `public void reloadCreativeSettings()`
- `public void updateCloudSettings()`
- `public boolean renderClouds(int cloudTicks, float partialTicks)`
- `public void refreshResources( IResourceType ... inclusion)`
- `public void refreshResources(java.util.function.Predicate< IResourceType > resourcePredicate)`
- `public <any> scheduleResourcesRefresh( IResourceType ... inclusion)`
- `public <any> scheduleResourcesRefresh(java.util.function.Predicate< IResourceType > resourcePredicate)`

## Description

Handles primary communication from hooked code into the system The FML entry point is beginMinecraftLoading(Minecraft, List, IReloadableResourceManager, MetadataSerializer) called from Minecraft Obfus
