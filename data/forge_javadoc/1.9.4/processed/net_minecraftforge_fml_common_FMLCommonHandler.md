# FMLCommonHandler

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.FMLCommonHandler

## Class signature

```java
public class FMLCommonHandler extends java.lang.Object
```

## Methods

- `void addModToResourcePack(ModContainer container)`
- `void beginLoading(IFMLSidedHandler handler)`
- `void bootstrap()`
- `@Deprecated EventBus bus()`
- `static void callFuture(java.util.concurrent.FutureTask<?> task)`
- `void computeBranding()`
- `void confirmBackupLevelDatUse(SaveHandler handler)`
- `void enhanceCrashReport(CrashReport crashReport, CrashReportCategory category)`
- `void exitJava(int exitCode, boolean hardExit)` — Used to exit from java, with system exit preventions in place.
- `void expectServerStopped()` — Make handleExit() wait for handleServerStopped().
- `ModContainer findContainerFor(java.lang.Object mod)` — Find the container that associates with the supplied mod object
- `void fireKeyInput()`
- `void fireMouseInput()`
- `void fireNetRegistrationEvent(NetworkManager manager, java.util.Set<java.lang.String> channelSet, java.lang.String channel, Side side)`
- `void firePlayerChangedDimensionEvent(EntityPlayer player, int fromDim, int toDim)`
- `void firePlayerCraftingEvent(EntityPlayer player, ItemStack crafted, IInventory craftMatrix)`
- `void firePlayerItemPickupEvent(EntityPlayer player, EntityItem item)`
- `void firePlayerLoggedIn(EntityPlayer player)`
- `void firePlayerLoggedOut(EntityPlayer player)`
- `void firePlayerRespawnEvent(EntityPlayer player)`
- `void firePlayerSmeltedEvent(EntityPlayer player, ItemStack smelted)`
- `java.util.List<java.lang.String> getBrandings(boolean includeMC)`
- `INetHandler getClientPlayHandler()`
- `NetworkManager getClientToServerNetworkManager()`
- `java.lang.String getCurrentLanguage()`
- `Side getEffectiveSide()` — Return the effective side for the context in the game.
- `org.apache.logging.log4j.Logger getFMLLogger()` — Get the forge mod loader logging instance (goes to the forgemodloader log file)
- `MinecraftServer getMinecraftServerInstance()`
- `java.lang.String getModName()`
- `java.io.File getSavesDirectory()`
- `Side getSide()`
- `IFMLSidedHandler getSidedDelegate()`
- `IThreadListener getWorldThread(INetHandler net)`
- `void handleExit(int retVal)` — Delayed System.exit() until the server is actually stopped/done saving.
- `boolean handleServerAboutToStart(MinecraftServer server)`
- `boolean handleServerHandshake(C00Handshake packet, NetworkManager manager)` — Process initial Handshake packet, kicks players from the server if they are connecting while we are starting up.
- `void handleServerStarted()`
- `boolean handleServerStarting(MinecraftServer server)`
- `void handleServerStopped()`
- `void handleServerStopping()`
- `void handleWorldDataLoad(SaveHandler handler, WorldInfo worldInfo, NBTTagCompound tagCompound)`
- `void handleWorldDataSave(SaveHandler handler, WorldInfo worldInfo, NBTTagCompound tagCompound)`
- `static FMLCommonHandler instance()`
- `java.io.InputStream loadLanguage(java.util.Map<java.lang.String, java.lang.String> table, java.io.InputStream inputstream)` — Loads a lang file, first searching for a marker to enable the 'extended' format {escape characters} If the marker is not found it simply returns and let the vanilla code load things.
- `void onPlayerPostTick(EntityPlayer player)`
- `void onPlayerPreTick(EntityPlayer player)`
- `void onPostClientTick()`
- `void onPostServerTick()`
- `void onPostWorldTick(World world)` — Every tick just after world and other ticks occur
- `void onPreClientTick()`
- `void onPreServerTick()`
- `void onPreWorldTick(World world)` — Every tick just before world and other ticks occur
- `void onRenderTickEnd(float timer)`
- `void onRenderTickStart(float timer)`
- `void onServerStart(MinecraftServer dedicatedServer)`
- `void onServerStarted()`
- `void processWindowMessages()`
- `void queryUser(StartupQuery query)`
- `void raiseException(java.lang.Throwable exception, java.lang.String message, boolean stopGame)` — Raise an exception
- `void registerCrashCallable(ICrashCallable callable)`
- `boolean shouldAllowPlayerLogins()`
- `boolean shouldServerBeKilledQuietly()`
- `void showGuiScreen(java.lang.Object clientGuiElement)`
- `java.lang.String stripSpecialChars(java.lang.String message)`