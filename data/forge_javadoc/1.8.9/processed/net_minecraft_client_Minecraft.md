# Minecraft

**Inheritance:** java.lang.Object → net.minecraft.client.Minecraft

## Class signature

```java
public class Minecraft extends java.lang.Object implements IThreadListener, IPlayerUsage
```

## Constructors

- `Minecraft(GameConfiguration gameConfig)`

## Methods

- `CrashReport addGraphicsAndWorldToCrashReport(CrashReport theCrash)` — adds core server Info (GL version , Texture pack, isModded, type), and the worldInfo to the crash report
- `<V><any> addScheduledTask(java.util.concurrent.Callable<V> callableToSchedule)`
- `<any> addScheduledTask(java.lang.Runnable runnableToSchedule)`
- `void addServerStatsToSnooper(PlayerUsageSnooper playerSnooper)`
- `void addServerTypeToSnooper(PlayerUsageSnooper playerSnooper)`
- `protected void checkWindowResize()`
- `void crashed(CrashReport crash)`
- `void dispatchKeypresses()`
- `void displayCrashReport(CrashReport crashReportIn)` — Wrapper around displayCrashReportInternal
- `void displayGuiScreen(GuiScreen guiScreenIn)` — Sets the argument GuiScreen as the main (topmost visible) screen.
- `void displayInGameMenu()` — Displays the ingame menu
- `void drawSplashScreen(TextureManager textureManagerInstance)`
- `void freeMemory()`
- `PropertyMap func_181037_M()`
- `MusicTicker func_181535_r()`
- `void func_181536_a(int p_181536_1_, int p_181536_2_, int p_181536_3_, int p_181536_4_, int p_181536_5_, int p_181536_6_, int p_181536_7_, int p_181536_8_, int p_181536_9_, int p_181536_10_)`
- `FrameTimer func_181539_aj()`
- `boolean func_181540_al()`
- `MusicTicker.MusicType getAmbientMusicType()`
- `BlockRendererDispatcher getBlockRendererDispatcher()`
- `ServerData getCurrentServerData()`
- `static int getDebugFPS()`
- `Framebuffer getFramebuffer()`
- `static int getGLMaximumTextureSize()` — Used in the usage snooper.
- `IntegratedServer getIntegratedServer()` — Returns the currently running integrated server
- `ItemRenderer getItemRenderer()`
- `LanguageManager getLanguageManager()`
- `int getLimitFramerate()`
- `static Minecraft getMinecraft()` — Return the singleton Minecraft instance for the game
- `NetHandlerPlayClient getNetHandler()`
- `PlayerUsageSnooper getPlayerUsageSnooper()` — Returns the PlayerUsageSnooper instance.
- `java.net.Proxy getProxy()`
- `RenderItem getRenderItem()`
- `RenderManager getRenderManager()`
- `Entity getRenderViewEntity()`
- `IResourceManager getResourceManager()`
- `ResourcePackRepository getResourcePackRepository()`
- `ISaveFormat getSaveLoader()` — Returns the save loader that is currently being used
- `Session getSession()`
- `static java.util.Map<java.lang.String, java.lang.String> getSessionInfo()`
- `MinecraftSessionService getSessionService()`
- `SkinManager getSkinManager()`
- `SoundHandler getSoundHandler()`
- `static long getSystemTime()` — Gets the system time in milliseconds.
- `TextureManager getTextureManager()`
- `TextureMap getTextureMapBlocks()`
- `PropertyMap getTwitchDetails()`
- `IStream getTwitchStream()`
- `java.lang.String getVersion()`
- `static boolean isAmbientOcclusionEnabled()` — Returns if ambient occlusion is enabled
- `boolean isCallingFromMinecraftThread()`
- `boolean isDemo()` — Gets whether this is a demo or not.
- `static boolean isFancyGraphicsEnabled()`
- `boolean isFramerateLimitBelowMax()`
- `boolean isFullScreen()` — Returns whether we're in full screen or not.
- `boolean isGamePaused()`
- `static boolean isGuiEnabled()`
- `boolean isIntegratedServerRunning()`
- `boolean isJava64bit()`
- `boolean isSingleplayer()` — Returns true if there is only one player playing, and the current server is the integrated one.
- `boolean isSnooperEnabled()` — Returns whether snooping is enabled or not.
- `boolean isUnicode()`
- `void launchIntegratedServer(java.lang.String folderName, java.lang.String worldName, WorldSettings worldSettingsIn)` — Arguments: World foldername, World ingame name, WorldSettings
- `void loadWorld(WorldClient worldClientIn)` — unloads the current world first
- `void loadWorld(WorldClient worldClientIn, java.lang.String loadingMessage)` — par2Str is displayed on the loading screen to the user unloads the current world first
- `void refreshResources()`
- `void resize(int width, int height)` — Called to resize the current screen.
- `void run()`
- `void runTick()` — Runs the current tick.
- `<any> scheduleResourcesRefresh()`
- `void setConnectedToRealms(boolean p_181537_1_)` — Set if the player is connected to a realms server
- `void setDimensionAndSpawnPlayer(int dimension)`
- `void setIngameFocus()` — Will set the focus to ingame if the Minecraft window is the active with focus.
- `void setIngameNotInFocus()` — Resets the player keystate, disables the ingame focus, and ungrabs the mouse cursor.
- `void setRenderViewEntity(Entity viewingEntity)`
- `void setServerData(ServerData serverDataIn)` — Set the current ServerData instance.
- `void shutdown()` — Called when the window is closing.
- `void shutdownMinecraftApplet()` — Shuts down the minecraft applet by stopping the resource downloads, and clearing up GL stuff; called when the application (or web page) is exited.
- `static void stopIntegratedServer()`
- `void toggleFullscreen()` — Toggles fullscreen mode.
- `void updateDisplay()`

## Fields

- `GuiScreen currentScreen` — The GuiScreen that's being displayed at the moment.
- `java.lang.String debug` — String that shows the debug information
- `int displayHeight`
- `int displayWidth`
- `EffectRenderer effectRenderer`
- `EntityRenderer entityRenderer`
- `boolean field_175611_D`
- `boolean field_175613_B`
- `boolean field_175614_C`
- `FrameTimer field_181542_y`
- `FontRenderer fontRendererObj` — The font renderer used for displaying and measuring text
- `GameSettings gameSettings` — The game settings that currently hold effect.
- `GuiAchievement guiAchievement` — Gui achievement
- `GuiIngame ingameGUI`
- `boolean inGameHasFocus` — Does the actual gameplay have focus.
- `static boolean isRunningOnMac`
- `LoadingScreenRenderer loadingScreen`
- `java.io.File mcDataDir`
- `DefaultResourcePack mcDefaultResourcePack`
- `Profiler mcProfiler` — The profiler instance
- `static byte[] memoryReserve` — A 10MiB preallocation to ensure the heap is reasonably sized.
- `MouseHelper mouseHelper` — Mouse helper instance.
- `MovingObjectPosition objectMouseOver` — The ray trace hit that the mouse is over.
- `PlayerControllerMP playerController`
- `Entity pointedEntity`
- `boolean renderChunksMany`
- `TextureManager renderEngine` — The RenderEngine instance used by Minecraft
- `RenderGlobal renderGlobal`
- `boolean skipRenderWorld` — Skip render world
- `FontRenderer standardGalacticFontRenderer`
- `EntityPlayerSP thePlayer`
- `WorldClient theWorld`