# Minecraft

**Inheritance:** java.lang.Object → net.minecraft.client.Minecraft

## Class signature

```java
public class Minecraft extends java.lang.Object implements IPlayerUsage
```

## Constructors

- `Minecraft(Session p_i1103_1_, int p_i1103_2_, int p_i1103_3_, boolean p_i1103_4_, boolean p_i1103_5_, java.io.File p_i1103_6_, java.io.File p_i1103_7_, java.io.File p_i1103_8_, java.net.Proxy p_i1103_9_, java.lang.String p_i1103_10_, Multimap p_i1103_11_, java.lang.String p_i1103_12_)`

## Methods

- `CrashReport addGraphicsAndWorldToCrashReport(CrashReport p_71396_1_)`
- `void addServerStatsToSnooper(PlayerUsageSnooper p_70000_1_)`
- `void addServerTypeToSnooper(PlayerUsageSnooper p_70001_1_)`
- `void crashed(CrashReport p_71404_1_)`
- `java.lang.String debugInfoEntities()`
- `java.lang.String debugInfoRenders()`
- `void displayCrashReport(CrashReport p_71377_1_)`
- `void displayGuiScreen(GuiScreen p_147108_1_)`
- `void displayInGameMenu()`
- `void freeMemory()`
- `ServerData func_147104_D()`
- `MusicTicker.MusicType func_147109_W()`
- `void func_147120_f()`
- `Multimap func_152341_N()`
- `SkinManager func_152342_ad()`
- `ListenableFuture func_152343_a(java.util.concurrent.Callable p_152343_1_)`
- `ListenableFuture func_152344_a(java.lang.Runnable p_152344_1_)`
- `boolean func_152345_ab()`
- `IStream func_152346_Z()`
- `MinecraftSessionService func_152347_ac()`
- `void func_152348_aa()`
- `boolean func_152349_b()`
- `java.lang.String getEntityDebug()`
- `Framebuffer getFramebuffer()`
- `static int getGLMaximumTextureSize()`
- `IntegratedServer getIntegratedServer()`
- `LanguageManager getLanguageManager()`
- `int getLimitFramerate()`
- `static Minecraft getMinecraft()`
- `NetHandlerPlayClient getNetHandler()`
- `PlayerUsageSnooper getPlayerUsageSnooper()`
- `java.net.Proxy getProxy()`
- `IResourceManager getResourceManager()`
- `ResourcePackRepository getResourcePackRepository()`
- `ISaveFormat getSaveLoader()`
- `Session getSession()`
- `SoundHandler getSoundHandler()`
- `static long getSystemTime()`
- `TextureManager getTextureManager()`
- `TextureMap getTextureMapBlocks()`
- `java.lang.String getWorldProviderName()`
- `static boolean isAmbientOcclusionEnabled()`
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
- `void launchIntegratedServer(java.lang.String p_71371_1_, java.lang.String p_71371_2_, WorldSettings p_71371_3_)`
- `void loadScreen()`
- `void loadWorld(WorldClient p_71403_1_)`
- `void loadWorld(WorldClient p_71353_1_, java.lang.String p_71353_2_)`
- `void refreshResources()`
- `void resize(int p_71370_1_, int p_71370_2_)`
- `void run()`
- `void runTick()`
- `void scaledTessellator(int p_71392_1_, int p_71392_2_, int p_71392_3_, int p_71392_4_, int p_71392_5_, int p_71392_6_)`
- `void scheduleResourcesRefresh()`
- `void setDimensionAndSpawnPlayer(int p_71354_1_)`
- `void setIngameFocus()`
- `void setIngameNotInFocus()`
- `void setServer(java.lang.String p_71367_1_, int p_71367_2_)`
- `void setServerData(ServerData p_71351_1_)`
- `void shutdown()`
- `void shutdownMinecraftApplet()`
- `static void stopIntegratedServer()`
- `void toggleFullscreen()`

## Fields

- `GuiScreen currentScreen`
- `java.lang.String debug`
- `int displayHeight`
- `int displayWidth`
- `EffectRenderer effectRenderer`
- `EntityRenderer entityRenderer`
- `FontRenderer fontRenderer`
- `GameSettings gameSettings`
- `GuiAchievement guiAchievement`
- `GuiIngame ingameGUI`
- `boolean inGameHasFocus`
- `static boolean isRunningOnMac`
- `LoadingScreenRenderer loadingScreen`
- `java.io.File mcDataDir`
- `DefaultResourcePack mcDefaultResourcePack`
- `Profiler mcProfiler`
- `static byte[] memoryReserve`
- `MouseHelper mouseHelper`
- `MovingObjectPosition objectMouseOver`
- `PlayerControllerMP playerController`
- `Entity pointedEntity`
- `TextureManager renderEngine`
- `RenderGlobal renderGlobal`
- `EntityLivingBase renderViewEntity`
- `boolean skipRenderWorld`
- `FontRenderer standardGalacticFontRenderer`
- `EntityClientPlayerMP thePlayer`
- `WorldClient theWorld`