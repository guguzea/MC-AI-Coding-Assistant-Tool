---
title: "Minecraft"
description: "public class Minecraft extends java.lang.Object implements IThreadListener, ISnooperInfo"
package: "net/minecraft/client"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/Minecraft.html"
sourceType: javadoc
---

# Minecraft

**Inheritance:** java.lang.Object → net.minecraft.client.Minecraft

## Class signature

```java
public class Minecraft extends java.lang.Object implements IThreadListener, ISnooperInfo
```

## Constructors

- `Minecraft(GameConfiguration gameConfig)`

## Methods

- `CrashReport addGraphicsAndWorldToCrashReport(CrashReport theCrash)`
- `<V> com.google.common.util.concurrent.ListenableFuture<V> addScheduledTask(java.util.concurrent.Callable<V> callableToSchedule)`
- `com.google.common.util.concurrent.ListenableFuture<java.lang.Object> addScheduledTask(java.lang.Runnable runnableToSchedule)`
- `void addServerStatsToSnooper(Snooper playerSnooper)`
- `void addServerTypeToSnooper(Snooper playerSnooper)`
- `protected void checkWindowResize()`
- `void crashed(CrashReport crash)`
- `void dispatchKeypresses()`
- `void displayCrashReport(CrashReport crashReportIn)`
- `void displayGuiScreen(GuiScreen guiScreenIn)`
- `void displayInGameMenu()`
- `void draw(int posX, int posY, int texU, int texV, int width, int height, int red, int green, int blue, int alpha)`
- `void drawSplashScreen(TextureManager textureManagerInstance)`
- `void freeMemory()`
- `MusicTicker.MusicType getAmbientMusicType()`
- `BlockColors getBlockColors()`
- `BlockRendererDispatcher getBlockRendererDispatcher()`
- `NetHandlerPlayClient getConnection()`
- `ServerData getCurrentServerData()`
- `DataFixer getDataFixer()`
- `static int getDebugFPS()`
- `Framebuffer getFramebuffer()`
- `FrameTimer getFrameTimer()`
- `static int getGLMaximumTextureSize()`
- `IntegratedServer getIntegratedServer()`
- `ItemColors getItemColors()`
- `ItemRenderer getItemRenderer()`
- `LanguageManager getLanguageManager()`
- `int getLimitFramerate()`
- `static Minecraft getMinecraft()`
- `MusicTicker getMusicTicker()`
- `Snooper getPlayerUsageSnooper()`
- `com.mojang.authlib.properties.PropertyMap getProfileProperties()`
- `java.net.Proxy getProxy()`
- `RenderItem getRenderItem()`
- `RenderManager getRenderManager()`
- `float getRenderPartialTicks()`
- `Entity getRenderViewEntity()`
- `IResourceManager getResourceManager()`
- `ResourcePackRepository getResourcePackRepository()`
- `ISaveFormat getSaveLoader()`
- `Session getSession()`
- `static java.util.Map<java.lang.String, java.lang.String> getSessionInfo()`
- `com.mojang.authlib.minecraft.MinecraftSessionService getSessionService()`
- `SkinManager getSkinManager()`
- `SoundHandler getSoundHandler()`
- `static long getSystemTime()`
- `TextureManager getTextureManager()`
- `TextureMap getTextureMapBlocks()`
- `java.lang.String getVersion()`
- `java.lang.String getVersionType()`
- `static boolean isAmbientOcclusionEnabled()`
- `boolean isCallingFromMinecraftThread()`
- `boolean isConnectedToRealms()`
- `boolean isDemo()`
- `static boolean isFancyGraphicsEnabled()`
- `boolean isFramerateLimitBelowMax()`
- `boolean isFullScreen()`
- `boolean isGamePaused()`
- `static boolean isGuiEnabled()`
- `boolean isIntegratedServerRunning()`
- `boolean isJava64bit()`
- `boolean isSingleplayer()`
- `boolean isSnooperEnabled()`
- `boolean isUnicode()`
- `void launchIntegratedServer(java.lang.String folderName, java.lang.String worldName, WorldSettings worldSettingsIn)`
- `void loadWorld(WorldClient worldClientIn)`
- `void loadWorld(WorldClient worldClientIn, java.lang.String loadingMessage)`
- `void refreshResources()`
- `void resize(int width, int height)`
- `void run()`
- `void runTick()`
- `com.google.common.util.concurrent.ListenableFuture<java.lang.Object> scheduleResourcesRefresh()`
- `void setConnectedToRealms(boolean isConnected)`
- `void setDimensionAndSpawnPlayer(int dimension)`
- `void setIngameFocus()`
- `void setIngameNotInFocus()`
- `void setRenderViewEntity(Entity viewingEntity)`
- `void setServerData(ServerData serverDataIn)`
- `void shutdown()`
- `void shutdownMinecraftApplet()`
- `static void stopIntegratedServer()`
- `ItemStack storeTEInStack(ItemStack stack, TileEntity te)`
- `void toggleFullscreen()`
- `void updateDisplay()`

## Fields

- `boolean chunkPath`
- `boolean chunkVisibility`
- `GuiScreen currentScreen`
- `java.lang.String debug`
- `DebugRenderer debugRenderer`
- `int displayHeight`
- `int displayWidth`
- `ParticleManager effectRenderer`
- `EntityRenderer entityRenderer`
- `FontRenderer fontRendererObj`
- `FrameTimer frameTimer`
- `GameSettings gameSettings`
- `GuiAchievement guiAchievement`
- `GuiIngame ingameGUI`
- `boolean inGameHasFocus`
- `static boolean IS_RUNNING_ON_MAC`
- `LoadingScreenRenderer loadingScreen`
- `java.io.File mcDataDir`
- `DefaultResourcePack mcDefaultResourcePack`
- `Profiler mcProfiler`
- `static byte[] memoryReserve`
- `MouseHelper mouseHelper`
- `RayTraceResult objectMouseOver`
- `PlayerControllerMP playerController`
- `Entity pointedEntity`
- `boolean renderChunksMany`
- `TextureManager renderEngine`
- `RenderGlobal renderGlobal`
- `boolean skipRenderWorld`
- `FontRenderer standardGalacticFontRenderer`
- `EntityPlayerSP thePlayer`
- `WorldClient theWorld`
- `boolean wireframe`
