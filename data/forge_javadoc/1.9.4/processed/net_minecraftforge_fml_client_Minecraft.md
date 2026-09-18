# Minecraft

## Class signature

```java
public class Minecraft extends java.lang.Object implements IThreadListener , ISnooperInfo
```

## Constructors

- `public Minecraft( GameConfiguration gameConfig)`

## Methods

- `public void run()`
- `public Framebuffer getFramebuffer()`
- `public java.lang.String getVersion()`
- `public java.lang.String getVersionType()`
- `public void crashed( CrashReport crash)`
- `public void displayCrashReport( CrashReport crashReportIn)`
- `public boolean isUnicode()`
- `public void refreshResources()`
- `public void drawSplashScreen( TextureManager textureManagerInstance) throws org.lwjgl.LWJGLException`
- `public void draw(int posX, int posY, int texU, int texV, int width, int height, int red, int green, int blue, int alpha)`
- `public ISaveFormat getSaveLoader()`
- `public void displayGuiScreen(@Nullable GuiScreen guiScreenIn)`
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
- `public MusicTicker getMusicTicker()`
- `public void runTick() throws java.io.IOException`
- `public void launchIntegratedServer(java.lang.String folderName, java.lang.String worldName, @Nullable WorldSettings worldSettingsIn)`
- `public void loadWorld( WorldClient worldClientIn)`
- `public void loadWorld(@Nullable WorldClient worldClientIn, java.lang.String loadingMessage)`
- `public void setDimensionAndSpawnPlayer(int dimension)`
- `public final boolean isDemo()`
- `public NetHandlerPlayClient getConnection()`
- `public static boolean isGuiEnabled()`
- `public static boolean isFancyGraphicsEnabled()`
- `public static boolean isAmbientOcclusionEnabled()`
- `public ItemStack storeTEInStack( ItemStack stack, TileEntity te)`
- `public CrashReport addGraphicsAndWorldToCrashReport( CrashReport theCrash)`
- `public static Minecraft getMinecraft()`
- `public com.google.common.util.concurrent.ListenableFuture<java.lang.Object> scheduleResourcesRefresh()`
- `public void addServerStatsToSnooper( Snooper playerSnooper)`
- `public void addServerTypeToSnooper( Snooper playerSnooper)`
- `public static int getGLMaximumTextureSize()`
- `public boolean isSnooperEnabled()`
- `public void setServerData( ServerData serverDataIn)`
- `public ServerData getCurrentServerData()`
- `public boolean isIntegratedServerRunning()`
- `public boolean isSingleplayer()`
- `public IntegratedServer getIntegratedServer()`
- `public static void stopIntegratedServer()`
- `public Snooper getPlayerUsageSnooper()`
- `public static long getSystemTime()`
- `public boolean isFullScreen()`
- `public Session getSession()`
- `public com.mojang.authlib.properties.PropertyMap getProfileProperties()`
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
- `public void dispatchKeypresses()`
- `public com.mojang.authlib.minecraft.MinecraftSessionService getSessionService()`
- `public SkinManager getSkinManager()`
- `public Entity getRenderViewEntity()`
- `public void setRenderViewEntity( Entity viewingEntity)`
- `public <V> com.google.common.util.concurrent.ListenableFuture<V> addScheduledTask(java.util.concurrent.Callable<V> callableToSchedule)`
- `public com.google.common.util.concurrent.ListenableFuture<java.lang.Object> addScheduledTask(java.lang.Runnable runnableToSchedule)`
- `public boolean isCallingFromMinecraftThread()`
- `public BlockRendererDispatcher getBlockRendererDispatcher()`
- `public RenderManager getRenderManager()`
- `public RenderItem getRenderItem()`
- `public ItemRenderer getItemRenderer()`
- `public static int getDebugFPS()`
- `public FrameTimer getFrameTimer()`
- `public static java.util.Map<java.lang.String,java.lang.String> getSessionInfo()`
- `public boolean isConnectedToRealms()`
- `public void setConnectedToRealms(boolean isConnected)`
- `public DataFixer getDataFixer()`
- `public float getRenderPartialTicks()`
- `public BlockColors getBlockColors()`
- `public ItemColors getItemColors()`