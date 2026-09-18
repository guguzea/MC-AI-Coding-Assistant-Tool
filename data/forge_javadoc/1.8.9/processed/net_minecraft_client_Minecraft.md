# Minecraft

## Class signature

```java
public class Minecraft extends java.lang.Object implements IThreadListener , IPlayerUsage
```

## Constructors

- `public Minecraft( GameConfiguration gameConfig)`

## Methods

- `public void run()`
- `public Framebuffer getFramebuffer()`
- `public java.lang.String getVersion()`
- `public void crashed( CrashReport crash)`
- `public void displayCrashReport( CrashReport crashReportIn)`
- `public boolean isUnicode()`
- `public void refreshResources()`
- `public void drawSplashScreen( TextureManager textureManagerInstance) throws LWJGLException`
- `public void func_181536_a(int p_181536_1_, int p_181536_2_, int p_181536_3_, int p_181536_4_, int p_181536_5_, int p_181536_6_, int p_181536_7_, int p_181536_8_, int p_181536_9_, int p_181536_10_)`
- `public ISaveFormat getSaveLoader()`
- `public void displayGuiScreen( GuiScreen guiScreenIn)`
- `public void shutdownMinecraftApplet()`
- `public void updateDisplay()`
- `protected void checkWindowResize()`
- `public int getLimitFramerate()`
- `public boolean isFramerateLimitBelowMax()`
- `public void freeMemory()`
- `public void shutdown()`
- `public void setIngameFocus()`
- `public void setIngameNotInFocus()`
- `public void displayInGameMenu()`
- `public void toggleFullscreen()`
- `public void resize(int width, int height)`
- `public MusicTicker func_181535_r()`
- `public void runTick() throws java.io.IOException`
- `public void launchIntegratedServer(java.lang.String folderName, java.lang.String worldName, WorldSettings worldSettingsIn)`
- `public void loadWorld( WorldClient worldClientIn)`
- `public void loadWorld( WorldClient worldClientIn, java.lang.String loadingMessage)`
- `public void setDimensionAndSpawnPlayer(int dimension)`
- `public final boolean isDemo()`
- `public NetHandlerPlayClient getNetHandler()`
- `public static boolean isGuiEnabled()`
- `public static boolean isFancyGraphicsEnabled()`
- `public static boolean isAmbientOcclusionEnabled()`
- `public CrashReport addGraphicsAndWorldToCrashReport( CrashReport theCrash)`
- `public static Minecraft getMinecraft()`
- `public <any> scheduleResourcesRefresh()`
- `public void addServerStatsToSnooper( PlayerUsageSnooper playerSnooper)`
- `public void addServerTypeToSnooper( PlayerUsageSnooper playerSnooper)`
- `public static int getGLMaximumTextureSize()`
- `public boolean isSnooperEnabled()`
- `public void setServerData( ServerData serverDataIn)`
- `public ServerData getCurrentServerData()`
- `public boolean isIntegratedServerRunning()`
- `public boolean isSingleplayer()`
- `public IntegratedServer getIntegratedServer()`
- `public static void stopIntegratedServer()`
- `public PlayerUsageSnooper getPlayerUsageSnooper()`
- `public static long getSystemTime()`
- `public boolean isFullScreen()`
- `public Session getSession()`
- `public PropertyMap getTwitchDetails()`
- `public PropertyMap func_181037_M()`
- `public java.net.Proxy getProxy()`
- `public TextureManager getTextureManager()`
- `public IResourceManager getResourceManager()`
- `public ResourcePackRepository getResourcePackRepository()`
- `public LanguageManager getLanguageManager()`
- `public TextureMap getTextureMapBlocks()`
- `public boolean isJava64bit()`
- `public boolean isGamePaused()`
- `public SoundHandler getSoundHandler()`
- `public MusicTicker.MusicType getAmbientMusicType()`
- `public IStream getTwitchStream()`
- `public void dispatchKeypresses()`
- `public MinecraftSessionService getSessionService()`
- `public SkinManager getSkinManager()`
- `public Entity getRenderViewEntity()`
- `public void setRenderViewEntity( Entity viewingEntity)`
- `public <V> <any> addScheduledTask(java.util.concurrent.Callable<V> callableToSchedule)`
- `public <any> addScheduledTask(java.lang.Runnable runnableToSchedule)`
- `public boolean isCallingFromMinecraftThread()`
- `public BlockRendererDispatcher getBlockRendererDispatcher()`
- `public RenderManager getRenderManager()`
- `public RenderItem getRenderItem()`
- `public ItemRenderer getItemRenderer()`
- `public static int getDebugFPS()`
- `public FrameTimer func_181539_aj()`
- `public static java.util.Map<java.lang.String,java.lang.String> getSessionInfo()`
- `public boolean func_181540_al()`
- `public void setConnectedToRealms(boolean p_181537_1_)`

## Description

The GuiScreen that's being displayed at the moment.