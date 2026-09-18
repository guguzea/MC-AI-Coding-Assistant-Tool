---
title: "Minecraft"
description: "public class Minecraft extends java.lang.Object implements IPlayerUsage"
package: "net/minecraft/client"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/client/Minecraft.html"
sourceType: javadoc
---

# Minecraft

## Class signature

```java
public class Minecraft extends java.lang.Object implements IPlayerUsage
```

## Constructors

- `public Minecraft( Session p_i1103_1_, int p_i1103_2_, int p_i1103_3_, boolean p_i1103_4_, boolean p_i1103_5_, java.io.File p_i1103_6_, java.io.File p_i1103_7_, java.io.File p_i1103_8_, java.net.Proxy p_i1103_9_, java.lang.String p_i1103_10_, Multimap p_i1103_11_, java.lang.String p_i1103_12_)`

## Methods

- `public Framebuffer getFramebuffer()`
- `public void crashed( CrashReport p_71404_1_)`
- `public void displayCrashReport( CrashReport p_71377_1_)`
- `public void setServer(java.lang.String p_71367_1_, int p_71367_2_)`
- `public boolean func_152349_b()`
- `public void refreshResources()`
- `public void loadScreen() throws LWJGLException`
- `public void scaledTessellator(int p_71392_1_, int p_71392_2_, int p_71392_3_, int p_71392_4_, int p_71392_5_, int p_71392_6_)`
- `public ISaveFormat getSaveLoader()`
- `public void displayGuiScreen( GuiScreen p_147108_1_)`
- `public void shutdownMinecraftApplet()`
- `public void run()`
- `public void func_147120_f()`
- `public int getLimitFramerate()`
- `public boolean isFramerateLimitBelowMax()`
- `public void freeMemory()`
- `public void shutdown()`
- `public void setIngameFocus()`
- `public void setIngameNotInFocus()`
- `public void displayInGameMenu()`
- `public void toggleFullscreen()`
- `public void resize(int p_71370_1_, int p_71370_2_)`
- `public void runTick()`
- `public void launchIntegratedServer(java.lang.String p_71371_1_, java.lang.String p_71371_2_, WorldSettings p_71371_3_)`
- `public void loadWorld( WorldClient p_71403_1_)`
- `public void loadWorld( WorldClient p_71353_1_, java.lang.String p_71353_2_)`
- `public java.lang.String debugInfoRenders()`
- `public java.lang.String getEntityDebug()`
- `public java.lang.String getWorldProviderName()`
- `public java.lang.String debugInfoEntities()`
- `public void setDimensionAndSpawnPlayer(int p_71354_1_)`
- `public final boolean isDemo()`
- `public NetHandlerPlayClient getNetHandler()`
- `public static boolean isGuiEnabled()`
- `public static boolean isFancyGraphicsEnabled()`
- `public static boolean isAmbientOcclusionEnabled()`
- `public CrashReport addGraphicsAndWorldToCrashReport( CrashReport p_71396_1_)`
- `public static Minecraft getMinecraft()`
- `public void scheduleResourcesRefresh()`
- `public void addServerStatsToSnooper( PlayerUsageSnooper p_70000_1_)`
- `public void addServerTypeToSnooper( PlayerUsageSnooper p_70001_1_)`
- `public static int getGLMaximumTextureSize()`
- `public boolean isSnooperEnabled()`
- `public void setServerData( ServerData p_71351_1_)`
- `public ServerData func_147104_D()`
- `public boolean isIntegratedServerRunning()`
- `public boolean isSingleplayer()`
- `public IntegratedServer getIntegratedServer()`
- `public static void stopIntegratedServer()`
- `public PlayerUsageSnooper getPlayerUsageSnooper()`
- `public static long getSystemTime()`
- `public boolean isFullScreen()`
- `public Session getSession()`
- `public Multimap func_152341_N()`
- `public java.net.Proxy getProxy()`
- `public TextureManager getTextureManager()`
- `public IResourceManager getResourceManager()`
- `public ResourcePackRepository getResourcePackRepository()`
- `public LanguageManager getLanguageManager()`
- `public TextureMap getTextureMapBlocks()`
- `public boolean isJava64bit()`
- `public boolean isGamePaused()`
- `public SoundHandler getSoundHandler()`
- `public MusicTicker.MusicType func_147109_W()`
- `public IStream func_152346_Z()`
- `public void func_152348_aa()`
- `public ListenableFuture func_152343_a(java.util.concurrent.Callable p_152343_1_)`
- `public ListenableFuture func_152344_a(java.lang.Runnable p_152344_1_)`
- `public boolean func_152345_ab()`
- `public MinecraftSessionService func_152347_ac()`
- `public SkinManager func_152342_ad()`
