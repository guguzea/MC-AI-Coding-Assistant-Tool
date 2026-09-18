---
title: "FMLCommonHandler"
description: "The main class for non-obfuscated hook handling code Anything that doesn't require obfuscated or client/server specific code should go in this handler It also contains a reference to the sided handler"
package: "net/minecraftforge/fml/common"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/FMLCommonHandler.html"
sourceType: javadoc
---

# FMLCommonHandler

## Class signature

```java
public class FMLCommonHandler extends java.lang.Object
```

## Methods

- `@Deprecated public EventBus bus()`
- `public java.util.List<java.lang.String> beginLoading( IFMLSidedHandler handler)`
- `public static FMLCommonHandler instance()`
- `public ModContainer findContainerFor(java.lang.Object mod)`
- `public org.apache.logging.log4j.Logger getFMLLogger()`
- `public Side getSide()`
- `public Side getEffectiveSide()`
- `public void raiseException(java.lang.Throwable exception, java.lang.String message, boolean stopGame)`
- `public void computeBranding()`
- `public java.util.List<java.lang.String> getBrandings(boolean includeMC)`
- `public IFMLSidedHandler getSidedDelegate()`
- `public void onPostServerTick()`
- `public void onPostWorldTick( World world)`
- `public void onPreServerTick()`
- `public void onPreWorldTick( World world)`
- `public boolean handleServerAboutToStart( MinecraftServer server)`
- `public boolean handleServerStarting( MinecraftServer server)`
- `public void handleServerStarted()`
- `public void handleServerStopping()`
- `public java.io.File getSavesDirectory()`
- `public MinecraftServer getMinecraftServerInstance()`
- `public void showGuiScreen(java.lang.Object clientGuiElement)`
- `public void queryUser( StartupQuery query) throws java.lang.InterruptedException`
- `public void onServerStart( MinecraftServer dedicatedServer)`
- `public void onServerStarted()`
- `public void onPreClientTick()`
- `public void onPostClientTick()`
- `public void onRenderTickStart(float timer)`
- `public void onRenderTickEnd(float timer)`
- `public void onPlayerPreTick( EntityPlayer player)`
- `public void onPlayerPostTick( EntityPlayer player)`
- `public void registerCrashCallable( ICrashCallable callable)`
- `public void enhanceCrashReport( CrashReport crashReport, CrashReportCategory category)`
- `public void handleWorldDataSave( SaveHandler handler, WorldInfo worldInfo, NBTTagCompound tagCompound)`
- `public void handleWorldDataLoad( SaveHandler handler, WorldInfo worldInfo, NBTTagCompound tagCompound)`
- `public void confirmBackupLevelDatUse( SaveHandler handler)`
- `public boolean shouldServerBeKilledQuietly()`
- `public void expectServerStopped()`
- `public void handleExit(int retVal)`
- `public void handleServerStopped()`
- `public java.lang.String getModName()`
- `public void addModToResourcePack( ModContainer container)`
- `public java.lang.String getCurrentLanguage()`
- `public void bootstrap()`
- `public NetworkManager getClientToServerNetworkManager()`
- `public void fireMouseInput()`
- `public void fireKeyInput()`
- `public void firePlayerChangedDimensionEvent( EntityPlayer player, int fromDim, int toDim)`
- `public void firePlayerLoggedIn( EntityPlayer player)`
- `public void firePlayerLoggedOut( EntityPlayer player)`
- `public void firePlayerRespawnEvent( EntityPlayer player)`
- `public void firePlayerItemPickupEvent( EntityPlayer player, EntityItem item)`
- `public void firePlayerCraftingEvent( EntityPlayer player, ItemStack crafted, IInventory craftMatrix)`
- `public void firePlayerSmeltedEvent( EntityPlayer player, ItemStack smelted)`
- `public INetHandler getClientPlayHandler()`
- `public void fireNetRegistrationEvent( NetworkManager manager, java.util.Set<java.lang.String> channelSet, java.lang.String channel, Side side)`
- `public boolean shouldAllowPlayerLogins()`
- `public boolean handleServerHandshake( C00Handshake packet, NetworkManager manager)`
- `public void processWindowMessages()`
- `public void exitJava(int exitCode, boolean hardExit)`
- `public IThreadListener getWorldThread( INetHandler net)`
- `public static void callFuture(java.util.concurrent.FutureTask<?> task)`
- `public java.io.InputStream loadLanguage(java.util.Map<java.lang.String,java.lang.String> table, java.io.InputStream inputstream) throws java.io.IOException`
- `public java.lang.String stripSpecialChars(java.lang.String message)`
- `public void reloadRenderers()`
- `public void fireSidedRegistryEvents()`
- `public boolean isDisplayVSyncForced()`

## Description

The main class for non-obfuscated hook handling code Anything that doesn't require obfuscated or client/server specific code should go in this handler It also contains a reference to the sided handler
