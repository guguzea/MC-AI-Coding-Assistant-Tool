# LiteLoader 1.8.9 API 签名面（真构件 javap）

> **证据等级 = 真构件 `javap`**（本档最高等级，与同目录 `verified-api.md` 同级）。本文件由构件字节直接读出，
> 不是源码树推断；供检索时**别再凭记忆拼 API 名**。即便同级，**仍不得**把本文件当成「可输出给用户的已核实名单」
> —— 对外结论以 `verified-api.md`（人工逐字复核过的窄表）为准。
>
> 来源/版权/边界：根 `THIRD_PARTY_NOTICES.md` 的「派生的签名面」条。上游**未给开放许可**（版权保留），
> 构件与源码树均不入库、不得再分发；本文件**只含类型名与成员签名**，注释散文 / 方法体 / 初始化值均未抽取。

生成：`node mcp-server/scripts/extract-liteloader-api-surface.mjs --write`（生成器 `extract-liteloader-api-surface.mjs@2`）  
版本钉：`1.8.9-20160414.153538-10`（显式给）  
构件：`liteloader-1.8.9-20160414.153538-10.jar` · md5 `12cbdc8c16de3552a2efa3582aa37738`（与 `--expect-md5` 给定值一致） · 667189 B  
javap：`21.0.12.1` · vanilla 类型可读性：**MCP 可读（真名）**

**计数（分母写清）**

- 构件内扫 `com/mumfrey/liteloader（顶层 + api/** + modconfig/**）` 候选类 **71** 个 → 顶层 public 类型 **70** 个（接口 60 / 类 7 / 枚举 1 / 注解 2）
- 成员签名 **209** 条 + 枚举常量 **2** 个
- 构件路线**没有形参名**：class 文件不带 `MethodParameters`（三版实测），参数只到类型
- 构件路线**看不到注解 `default` 值**（`javap` 不带 `-v` 时不显示 `AnnotationDefault`）
- 枚举按 class 文件原样显示为 `final class ... extends java.lang.Enum<…>`，并含编译器合成的 `values()` / `valueOf()`
- 含编译器合成的 **bridge method**（泛型擦除产物，多为返回 `java.lang.Object` 的同名重载；写作时按泛型真身取，别照抄桥）

## `com.mumfrey.liteloader`（33 类）

### `com.mumfrey.liteloader.ChatFilter`

**Interface** `public interface com.mumfrey.liteloader.ChatFilter extends com.mumfrey.liteloader.LiteMod`

- `public abstract boolean onChat(net.minecraft.util.IChatComponent, java.lang.String, com.mumfrey.liteloader.core.LiteLoaderEventBroker$ReturnValue<net.minecraft.util.IChatComponent>)`

### `com.mumfrey.liteloader.ChatListener`

**Interface** `public interface com.mumfrey.liteloader.ChatListener extends com.mumfrey.liteloader.LiteMod`

- `public abstract void onChat(net.minecraft.util.IChatComponent, java.lang.String)`

### `com.mumfrey.liteloader.ChatRenderListener`

**Interface** `public interface com.mumfrey.liteloader.ChatRenderListener extends com.mumfrey.liteloader.LiteMod`

- `public abstract void onPreRenderChat(int, int, net.minecraft.client.gui.GuiNewChat)`
- `public abstract void onPostRenderChat(int, int, net.minecraft.client.gui.GuiNewChat)`

### `com.mumfrey.liteloader.Configurable`

**Interface** `public interface com.mumfrey.liteloader.Configurable`

- `public abstract java.lang.Class<? extends com.mumfrey.liteloader.modconfig.ConfigPanel> getConfigPanelClass()`

### `com.mumfrey.liteloader.EntityRenderListener`

**Interface** `public interface com.mumfrey.liteloader.EntityRenderListener extends com.mumfrey.liteloader.LiteMod`

- `public abstract void onRenderEntity(net.minecraft.client.renderer.entity.Render<? extends net.minecraft.entity.Entity>, net.minecraft.entity.Entity, double, double, double, float, float)`
- `public abstract void onPostRenderEntity(net.minecraft.client.renderer.entity.Render<? extends net.minecraft.entity.Entity>, net.minecraft.entity.Entity, double, double, double, float, float)`

### `com.mumfrey.liteloader.FrameBufferListener`

**Interface** `public interface com.mumfrey.liteloader.FrameBufferListener extends com.mumfrey.liteloader.LiteMod`

- `public abstract void preRenderFBO(net.minecraft.client.shader.Framebuffer)`
- `public abstract void onRenderFBO(net.minecraft.client.shader.Framebuffer, int, int)`
- `public abstract void postRenderFBO(net.minecraft.client.shader.Framebuffer)`

### `com.mumfrey.liteloader.GameLoopListener`

**Interface** `public interface com.mumfrey.liteloader.GameLoopListener extends com.mumfrey.liteloader.LiteMod`

- `public abstract void onRunGameLoop(net.minecraft.client.Minecraft)`

### `com.mumfrey.liteloader.HUDRenderListener`

**Interface** `public interface com.mumfrey.liteloader.HUDRenderListener extends com.mumfrey.liteloader.LiteMod`

- `public abstract void onPreRenderHUD(int, int)`
- `public abstract void onPostRenderHUD(int, int)`

### `com.mumfrey.liteloader.InitCompleteListener`

**Interface** `public interface com.mumfrey.liteloader.InitCompleteListener extends com.mumfrey.liteloader.Tickable`

- `public abstract void onInitCompleted(net.minecraft.client.Minecraft, com.mumfrey.liteloader.core.LiteLoader)`

### `com.mumfrey.liteloader.JoinGameListener`

**Interface** `public interface com.mumfrey.liteloader.JoinGameListener extends com.mumfrey.liteloader.LiteMod`

- `public abstract void onJoinGame(net.minecraft.network.INetHandler, net.minecraft.network.play.server.S01PacketJoinGame, net.minecraft.client.multiplayer.ServerData, com.mojang.realmsclient.dto.RealmsServer)`

### `com.mumfrey.liteloader.LiteMod`

**Interface** `public interface com.mumfrey.liteloader.LiteMod extends com.mumfrey.liteloader.modconfig.Exposable,com.mumfrey.liteloader.api.Listener`

- `public abstract java.lang.String getVersion()`
- `public abstract void init(java.io.File)`
- `public abstract void upgradeSettings(java.lang.String, java.io.File, java.io.File)`

### `com.mumfrey.liteloader.OutboundChatFilter`

**Interface** `public interface com.mumfrey.liteloader.OutboundChatFilter extends com.mumfrey.liteloader.LiteMod`

- `public abstract boolean onSendChatMessage(java.lang.String)`

### `com.mumfrey.liteloader.OutboundChatListener`

**Interface** `public interface com.mumfrey.liteloader.OutboundChatListener extends com.mumfrey.liteloader.LiteMod`

- `public abstract void onSendChatMessage(net.minecraft.network.play.client.C01PacketChatMessage, java.lang.String)`

### `com.mumfrey.liteloader.PacketHandler`

**Interface** `public interface com.mumfrey.liteloader.PacketHandler extends com.mumfrey.liteloader.LiteMod`

- `public abstract java.util.List<java.lang.Class<? extends net.minecraft.network.Packet<?>>> getHandledPackets()`
- `public abstract boolean handlePacket(net.minecraft.network.INetHandler, net.minecraft.network.Packet<?>)`

### `com.mumfrey.liteloader.Permissible`

**Interface** `public interface com.mumfrey.liteloader.Permissible extends com.mumfrey.liteloader.LiteMod`

- `public abstract java.lang.String getPermissibleModName()`
- `public abstract float getPermissibleModVersion()`
- `public abstract void registerPermissions(com.mumfrey.liteloader.permissions.PermissionsManagerClient)`
- `public abstract void onPermissionsCleared(com.mumfrey.liteloader.permissions.PermissionsManager)`
- `public abstract void onPermissionsChanged(com.mumfrey.liteloader.permissions.PermissionsManager)`

### `com.mumfrey.liteloader.PlayerInteractionListener`

**Interface** `public interface com.mumfrey.liteloader.PlayerInteractionListener extends com.mumfrey.liteloader.LiteMod`

- `public abstract void onPlayerClickedAir(net.minecraft.entity.player.EntityPlayerMP, com.mumfrey.liteloader.PlayerInteractionListener$MouseButton, net.minecraft.util.BlockPos, net.minecraft.util.EnumFacing, net.minecraft.util.MovingObjectPosition$MovingObjectType)`
- `public abstract boolean onPlayerClickedBlock(net.minecraft.entity.player.EntityPlayerMP, com.mumfrey.liteloader.PlayerInteractionListener$MouseButton, net.minecraft.util.BlockPos, net.minecraft.util.EnumFacing)`

### `com.mumfrey.liteloader.PlayerMoveListener`

**Interface** `public interface com.mumfrey.liteloader.PlayerMoveListener extends com.mumfrey.liteloader.LiteMod`

- `public abstract boolean onPlayerMove(net.minecraft.entity.player.EntityPlayerMP, com.mumfrey.liteloader.util.Position, com.mumfrey.liteloader.util.Position, com.mumfrey.liteloader.core.LiteLoaderEventBroker$ReturnValue<com.mumfrey.liteloader.util.Position>)`

### `com.mumfrey.liteloader.PluginChannelListener`

**Interface** `public interface com.mumfrey.liteloader.PluginChannelListener extends com.mumfrey.liteloader.LiteMod,com.mumfrey.liteloader.core.CommonPluginChannelListener`

- `public abstract void onCustomPayload(java.lang.String, net.minecraft.network.PacketBuffer)`

### `com.mumfrey.liteloader.PostLoginListener`

**Interface** `public interface com.mumfrey.liteloader.PostLoginListener extends com.mumfrey.liteloader.LiteMod`

- `public abstract void onPostLogin(net.minecraft.network.login.INetHandlerLoginClient, net.minecraft.network.login.server.S02PacketLoginSuccess)`

### `com.mumfrey.liteloader.PostRenderListener`

**Interface** `public interface com.mumfrey.liteloader.PostRenderListener extends com.mumfrey.liteloader.LiteMod`

- `public abstract void onPostRenderEntities(float)`
- `public abstract void onPostRender(float)`

### `com.mumfrey.liteloader.PreJoinGameListener`

**Interface** `public interface com.mumfrey.liteloader.PreJoinGameListener extends com.mumfrey.liteloader.LiteMod`

- `public abstract boolean onPreJoinGame(net.minecraft.network.INetHandler, net.minecraft.network.play.server.S01PacketJoinGame)`

### `com.mumfrey.liteloader.PreRenderListener`

**Interface** `public interface com.mumfrey.liteloader.PreRenderListener extends com.mumfrey.liteloader.LiteMod`

- `public abstract void onRenderWorld(float)`
- `public abstract void onSetupCameraTransform(float, int, long)`
- `public abstract void onRenderSky(float, int)`
- `public abstract void onRenderClouds(float, int, net.minecraft.client.renderer.RenderGlobal)`
- `public abstract void onRenderTerrain(float, int)`

### `com.mumfrey.liteloader.Priority`

**Annotation** `public interface com.mumfrey.liteloader.Priority extends java.lang.annotation.Annotation`

- `public abstract int value()`

### `com.mumfrey.liteloader.RenderListener`

**Interface** `public interface com.mumfrey.liteloader.RenderListener extends com.mumfrey.liteloader.LiteMod`

- `public abstract void onRender()`
- `public abstract void onRenderGui(net.minecraft.client.gui.GuiScreen)`
- `public abstract void onSetupCameraTransform()`

### `com.mumfrey.liteloader.ScreenshotListener`

**Interface** `public interface com.mumfrey.liteloader.ScreenshotListener extends com.mumfrey.liteloader.LiteMod`

- `public abstract boolean onSaveScreenshot(java.lang.String, int, int, net.minecraft.client.shader.Framebuffer, com.mumfrey.liteloader.core.LiteLoaderEventBroker$ReturnValue<net.minecraft.util.IChatComponent>)`

### `com.mumfrey.liteloader.ServerChatFilter`

**Interface** `public interface com.mumfrey.liteloader.ServerChatFilter extends com.mumfrey.liteloader.LiteMod`

- `public abstract boolean onChat(net.minecraft.entity.player.EntityPlayerMP, net.minecraft.network.play.client.C01PacketChatMessage, java.lang.String)`

### `com.mumfrey.liteloader.ServerCommandProvider`

**Interface** `public interface com.mumfrey.liteloader.ServerCommandProvider extends com.mumfrey.liteloader.LiteMod`

- `public abstract void provideCommands(net.minecraft.command.ServerCommandManager)`

### `com.mumfrey.liteloader.ServerPlayerListener`

**Interface** `public interface com.mumfrey.liteloader.ServerPlayerListener extends com.mumfrey.liteloader.LiteMod`

- `public abstract void onPlayerConnect(net.minecraft.entity.player.EntityPlayerMP, com.mojang.authlib.GameProfile)`
- `public abstract void onPlayerLoggedIn(net.minecraft.entity.player.EntityPlayerMP)`
- `public abstract void onPlayerRespawn(net.minecraft.entity.player.EntityPlayerMP, net.minecraft.entity.player.EntityPlayerMP, int, boolean)`
- `public abstract void onPlayerLogout(net.minecraft.entity.player.EntityPlayerMP)`

### `com.mumfrey.liteloader.ServerPluginChannelListener`

**Interface** `public interface com.mumfrey.liteloader.ServerPluginChannelListener extends com.mumfrey.liteloader.core.CommonPluginChannelListener`

- `public abstract void onCustomPayload(net.minecraft.entity.player.EntityPlayerMP, java.lang.String, net.minecraft.network.PacketBuffer)`

### `com.mumfrey.liteloader.ServerTickable`

**Interface** `public interface com.mumfrey.liteloader.ServerTickable extends com.mumfrey.liteloader.LiteMod`

- `public abstract void onTick(net.minecraft.server.MinecraftServer)`

### `com.mumfrey.liteloader.ShutdownListener`

**Interface** `public interface com.mumfrey.liteloader.ShutdownListener extends com.mumfrey.liteloader.LiteMod`

- `public abstract void onShutDown()`

### `com.mumfrey.liteloader.Tickable`

**Interface** `public interface com.mumfrey.liteloader.Tickable extends com.mumfrey.liteloader.LiteMod`

- `public abstract void onTick(net.minecraft.client.Minecraft, float, boolean, boolean)`

### `com.mumfrey.liteloader.ViewportListener`

**Interface** `public interface com.mumfrey.liteloader.ViewportListener extends com.mumfrey.liteloader.LiteMod`

- `public abstract void onViewportResized(net.minecraft.client.gui.ScaledResolution, int, int)`
- `public abstract void onFullScreenToggled(boolean)`

## `com.mumfrey.liteloader.api`（22 类）

### `com.mumfrey.liteloader.api.BrandingProvider`

**Interface** `public interface com.mumfrey.liteloader.api.BrandingProvider extends com.mumfrey.liteloader.api.CustomisationProvider`

- `public abstract int getPriority()`
- `public abstract int getBrandingColour()`
- `public abstract net.minecraft.util.ResourceLocation getLogoResource()`
- `public abstract com.mumfrey.liteloader.util.render.Icon getLogoCoords()`
- `public abstract net.minecraft.util.ResourceLocation getIconResource()`
- `public abstract com.mumfrey.liteloader.util.render.Icon getIconCoords()`
- `public abstract java.lang.String getDisplayName()`
- `public abstract java.lang.String getCopyrightText()`
- `public abstract java.net.URI getHomepage()`
- `public abstract java.lang.String getTwitterUserName()`
- `public abstract net.minecraft.util.ResourceLocation getTwitterAvatarResource()`
- `public abstract com.mumfrey.liteloader.util.render.Icon getTwitterAvatarCoords()`

### `com.mumfrey.liteloader.api.ContainerRegistry`

**Interface** `public interface com.mumfrey.liteloader.api.ContainerRegistry`

- `public abstract void registerEnabledContainer(com.mumfrey.liteloader.interfaces.LoadableMod<?>)`
- `public abstract java.util.Collection<? extends com.mumfrey.liteloader.interfaces.LoadableMod<?>> getEnabledContainers()`
- `public abstract com.mumfrey.liteloader.interfaces.LoadableMod<?> getEnabledContainer(java.lang.String)`
- `public abstract void registerDisabledContainer(com.mumfrey.liteloader.interfaces.LoadableMod<?>, com.mumfrey.liteloader.api.ContainerRegistry$DisabledReason)`
- `public abstract java.util.Collection<? extends com.mumfrey.liteloader.core.ModInfo<com.mumfrey.liteloader.interfaces.Loadable<?>>> getDisabledContainers()`
- `public abstract boolean isDisabledContainer(com.mumfrey.liteloader.interfaces.LoadableMod<?>)`
- `public abstract void registerBadContainer(com.mumfrey.liteloader.interfaces.Loadable<?>, java.lang.String)`
- `public abstract java.util.Collection<? extends com.mumfrey.liteloader.core.ModInfo<com.mumfrey.liteloader.interfaces.Loadable<?>>> getBadContainers()`
- `public abstract void registerTweakContainer(com.mumfrey.liteloader.interfaces.TweakContainer<java.io.File>)`
- `public abstract java.util.Collection<com.mumfrey.liteloader.interfaces.TweakContainer<java.io.File>> getTweakContainers()`
- `public abstract void registerInjectedTweak(com.mumfrey.liteloader.interfaces.TweakContainer<java.io.File>)`
- `public abstract java.util.Collection<? extends com.mumfrey.liteloader.core.ModInfo<com.mumfrey.liteloader.interfaces.Loadable<?>>> getInjectedTweaks()`

### `com.mumfrey.liteloader.api.CoreProvider`

**Interface** `public interface com.mumfrey.liteloader.api.CoreProvider extends com.mumfrey.liteloader.api.TickObserver,com.mumfrey.liteloader.api.WorldObserver,com.mumfrey.liteloader.api.ShutdownObserver,com.mumfrey.liteloader.api.PostRenderObserver`

- `public abstract void onInit()`
- `public abstract void onPostInit(com.mumfrey.liteloader.common.GameEngine<?, ?>)`
- `public abstract void onPostInitComplete(com.mumfrey.liteloader.core.LiteLoaderMods)`
- `public abstract void onStartupComplete()`
- `public abstract void onJoinGame(net.minecraft.network.INetHandler, net.minecraft.network.play.server.S01PacketJoinGame)`

### `com.mumfrey.liteloader.api.CustomisationProvider`

**Interface** `public interface com.mumfrey.liteloader.api.CustomisationProvider`

_（无成员签名）_

### `com.mumfrey.liteloader.api.EnumerationObserver`

**Interface** `public interface com.mumfrey.liteloader.api.EnumerationObserver extends com.mumfrey.liteloader.api.Observer`

- `public abstract void onRegisterEnabledContainer(com.mumfrey.liteloader.interfaces.LoaderEnumerator, com.mumfrey.liteloader.interfaces.LoadableMod<?>)`
- `public abstract void onRegisterDisabledContainer(com.mumfrey.liteloader.interfaces.LoaderEnumerator, com.mumfrey.liteloader.interfaces.LoadableMod<?>, com.mumfrey.liteloader.api.ContainerRegistry$DisabledReason)`
- `public abstract void onRegisterTweakContainer(com.mumfrey.liteloader.interfaces.LoaderEnumerator, com.mumfrey.liteloader.interfaces.TweakContainer<java.io.File>)`
- `public abstract void onModAdded(com.mumfrey.liteloader.interfaces.LoaderEnumerator, com.mumfrey.liteloader.core.ModInfo<com.mumfrey.liteloader.interfaces.LoadableMod<?>>)`

### `com.mumfrey.liteloader.api.EnumeratorModule`

**Interface** `public interface com.mumfrey.liteloader.api.EnumeratorModule`

- `public abstract void init(com.mumfrey.liteloader.launch.LoaderEnvironment, com.mumfrey.liteloader.launch.LoaderProperties)`
- `public abstract void writeSettings(com.mumfrey.liteloader.launch.LoaderEnvironment, com.mumfrey.liteloader.launch.LoaderProperties)`
- `public abstract void enumerate(com.mumfrey.liteloader.interfaces.ModularEnumerator, java.lang.String)`
- `public abstract void injectIntoClassLoader(com.mumfrey.liteloader.interfaces.ModularEnumerator, net.minecraft.launchwrapper.LaunchClassLoader)`
- `public abstract void registerMods(com.mumfrey.liteloader.interfaces.ModularEnumerator, net.minecraft.launchwrapper.LaunchClassLoader)`

### `com.mumfrey.liteloader.api.EnumeratorPlugin`

**Interface** `public interface com.mumfrey.liteloader.api.EnumeratorPlugin`

- `public abstract void init(com.mumfrey.liteloader.launch.LoaderEnvironment, com.mumfrey.liteloader.launch.LoaderProperties)`
- `public abstract <T> java.util.List<java.lang.Class<? extends T>> getClasses(com.mumfrey.liteloader.interfaces.LoadableMod<?>, java.lang.ClassLoader, com.mumfrey.liteloader.api.ModClassValidator)`
- `public abstract boolean checkEnabled(com.mumfrey.liteloader.api.ContainerRegistry, com.mumfrey.liteloader.interfaces.LoadableMod<?>)`
- `public abstract boolean checkDependencies(com.mumfrey.liteloader.api.ContainerRegistry, com.mumfrey.liteloader.interfaces.LoadableMod<?>)`
- `public abstract boolean checkAPIRequirements(com.mumfrey.liteloader.api.ContainerRegistry, com.mumfrey.liteloader.interfaces.LoadableMod<?>)`

### `com.mumfrey.liteloader.api.GenericObserver`

**Interface** `public interface com.mumfrey.liteloader.api.GenericObserver<T> extends com.mumfrey.liteloader.api.Observer`

- `public abstract void onObservableEvent(java.lang.String, T...) throws java.lang.ClassCastException`

### `com.mumfrey.liteloader.api.InterfaceObserver`

**Interface** `public interface com.mumfrey.liteloader.api.InterfaceObserver extends com.mumfrey.liteloader.api.Observer`

- `public abstract void onRegisterListener(com.mumfrey.liteloader.api.InterfaceProvider, java.lang.Class<? extends com.mumfrey.liteloader.api.Listener>, com.mumfrey.liteloader.api.Listener)`

### `com.mumfrey.liteloader.api.InterfaceProvider`

**Interface** `public interface com.mumfrey.liteloader.api.InterfaceProvider`

- `public abstract java.lang.Class<? extends com.mumfrey.liteloader.api.Listener> getListenerBaseType()`
- `public abstract void registerInterfaces(com.mumfrey.liteloader.core.InterfaceRegistrationDelegate)`
- `public abstract void initProvider()`

### `com.mumfrey.liteloader.api.Listener`

**Interface** `public interface com.mumfrey.liteloader.api.Listener`

- `public abstract java.lang.String getName()`

### `com.mumfrey.liteloader.api.LiteAPI`

**Interface** `public interface com.mumfrey.liteloader.api.LiteAPI`

- `public abstract void init(com.mumfrey.liteloader.launch.LoaderEnvironment, com.mumfrey.liteloader.launch.LoaderProperties)`
- `public abstract java.lang.String getIdentifier()`
- `public abstract java.lang.String getName()`
- `public abstract java.lang.String getVersion()`
- `public abstract int getRevision()`
- `public abstract com.mumfrey.liteloader.api.MixinConfigProvider getMixins()`
- `public abstract java.lang.String[] getRequiredTransformers()`
- `public abstract java.lang.String[] getRequiredDownstreamTransformers()`
- `public abstract java.lang.String getModClassPrefix()`
- `public abstract java.util.List<com.mumfrey.liteloader.api.EnumeratorModule> getEnumeratorModules()`
- `public abstract java.util.List<com.mumfrey.liteloader.api.CoreProvider> getCoreProviders()`
- `public abstract java.util.List<com.mumfrey.liteloader.api.InterfaceProvider> getInterfaceProviders()`
- `public abstract java.util.List<com.mumfrey.liteloader.api.Observer> getPreInitObservers()`
- `public abstract java.util.List<com.mumfrey.liteloader.api.Observer> getObservers()`
- `public abstract java.util.List<com.mumfrey.liteloader.api.CustomisationProvider> getCustomisationProviders()`

### `com.mumfrey.liteloader.api.MixinConfigProvider`

**Interface** `public interface com.mumfrey.liteloader.api.MixinConfigProvider`

- `public abstract org.spongepowered.asm.mixin.MixinEnvironment$CompatibilityLevel getCompatibilityLevel()`
- `public abstract java.lang.String[] getMixinConfigs()`
- `public abstract java.lang.String[] getErrorHandlers()`

### `com.mumfrey.liteloader.api.ModClassValidator`

**Interface** `public interface com.mumfrey.liteloader.api.ModClassValidator`

- `public abstract boolean validateName(java.lang.String)`
- `public abstract boolean validateClass(java.lang.ClassLoader, java.lang.Class<?>)`

### `com.mumfrey.liteloader.api.ModInfoDecorator`

**Interface** `public interface com.mumfrey.liteloader.api.ModInfoDecorator extends com.mumfrey.liteloader.api.CustomisationProvider`

- `public abstract void addIcons(com.mumfrey.liteloader.core.ModInfo<?>, java.util.List<com.mumfrey.liteloader.util.render.IconTextured>)`
- `public abstract java.lang.String modifyStatusText(com.mumfrey.liteloader.core.ModInfo<?>, java.lang.String)`
- `public abstract void onDrawListEntry(int, int, float, int, int, int, int, boolean, com.mumfrey.liteloader.core.ModInfo<?>, int, int, int)`

### `com.mumfrey.liteloader.api.ModLoadObserver`

**Interface** `public interface com.mumfrey.liteloader.api.ModLoadObserver extends com.mumfrey.liteloader.api.Observer`

- `public abstract void onModLoaded(com.mumfrey.liteloader.LiteMod)`
- `public abstract void onPostModLoaded(com.mumfrey.liteloader.core.ModInfo<com.mumfrey.liteloader.interfaces.LoadableMod<?>>)`
- `public abstract void onModLoadFailed(com.mumfrey.liteloader.interfaces.LoadableMod<?>, java.lang.String, java.lang.String, java.lang.Throwable)`
- `public abstract void onPreInitMod(com.mumfrey.liteloader.LiteMod)`
- `public abstract void onPostInitMod(com.mumfrey.liteloader.LiteMod)`
- `public abstract void onMigrateModConfig(com.mumfrey.liteloader.LiteMod, java.io.File, java.io.File)`

### `com.mumfrey.liteloader.api.Observer`

**Interface** `public interface com.mumfrey.liteloader.api.Observer`

_（无成员签名）_

### `com.mumfrey.liteloader.api.PostRenderObserver`

**Interface** `public interface com.mumfrey.liteloader.api.PostRenderObserver extends com.mumfrey.liteloader.api.Observer`

- `public abstract void onPostRender(int, int, float)`

### `com.mumfrey.liteloader.api.ShutdownObserver`

**Interface** `public interface com.mumfrey.liteloader.api.ShutdownObserver extends com.mumfrey.liteloader.api.Observer`

- `public abstract void onShutDown()`

### `com.mumfrey.liteloader.api.TickObserver`

**Interface** `public interface com.mumfrey.liteloader.api.TickObserver extends com.mumfrey.liteloader.api.Observer`

- `public abstract void onTick(boolean, float, boolean)`

### `com.mumfrey.liteloader.api.TranslationProvider`

**Interface** `public interface com.mumfrey.liteloader.api.TranslationProvider extends com.mumfrey.liteloader.api.CustomisationProvider`

- `public abstract java.lang.String translate(java.lang.String, java.lang.Object...)`
- `public abstract java.lang.String translate(java.lang.String, java.lang.String, java.lang.Object...)`

### `com.mumfrey.liteloader.api.WorldObserver`

**Interface** `public interface com.mumfrey.liteloader.api.WorldObserver extends com.mumfrey.liteloader.api.Observer`

- `public abstract void onWorldChanged(net.minecraft.world.World)`

## `com.mumfrey.liteloader.api.exceptions`（4 类）

### `com.mumfrey.liteloader.api.exceptions.APIException`

**Class** `public abstract class com.mumfrey.liteloader.api.exceptions.APIException extends java.lang.RuntimeException`

- `public com.mumfrey.liteloader.api.exceptions.APIException()`
- `public com.mumfrey.liteloader.api.exceptions.APIException(java.lang.String)`
- `public com.mumfrey.liteloader.api.exceptions.APIException(java.lang.Throwable)`
- `public com.mumfrey.liteloader.api.exceptions.APIException(java.lang.String, java.lang.Throwable)`

### `com.mumfrey.liteloader.api.exceptions.InvalidAPIException`

**Class** `public class com.mumfrey.liteloader.api.exceptions.InvalidAPIException extends com.mumfrey.liteloader.api.exceptions.APIException`

- `public com.mumfrey.liteloader.api.exceptions.InvalidAPIException(java.lang.String, java.lang.Throwable)`
- `public com.mumfrey.liteloader.api.exceptions.InvalidAPIException(java.lang.String)`

### `com.mumfrey.liteloader.api.exceptions.InvalidAPIStateException`

**Class** `public class com.mumfrey.liteloader.api.exceptions.InvalidAPIStateException extends com.mumfrey.liteloader.api.exceptions.APIException`

- `public com.mumfrey.liteloader.api.exceptions.InvalidAPIStateException(java.lang.String)`

### `com.mumfrey.liteloader.api.exceptions.InvalidProviderException`

**Class** `public class com.mumfrey.liteloader.api.exceptions.InvalidProviderException extends com.mumfrey.liteloader.api.exceptions.APIException`

- `public com.mumfrey.liteloader.api.exceptions.InvalidProviderException(java.lang.String, java.lang.Throwable)`
- `public com.mumfrey.liteloader.api.exceptions.InvalidProviderException(java.lang.String)`

## `com.mumfrey.liteloader.api.manager`（3 类）

### `com.mumfrey.liteloader.api.manager.APIAdapter`

**Interface** `public interface com.mumfrey.liteloader.api.manager.APIAdapter`

- `public abstract void initMixins()`
- `public abstract java.util.List<java.lang.String> getRequiredTransformers()`
- `public abstract java.util.List<java.lang.String> getRequiredDownstreamTransformers()`
- `public abstract void registerInterfaces(com.mumfrey.liteloader.interfaces.InterfaceRegistry)`
- `public abstract java.util.List<com.mumfrey.liteloader.api.CoreProvider> getCoreProviders()`
- `public abstract java.util.List<? extends com.mumfrey.liteloader.api.Observer> getObservers(com.mumfrey.liteloader.api.LiteAPI)`
- `public abstract <T extends com.mumfrey.liteloader.api.Observer> java.util.List<T> getObservers(com.mumfrey.liteloader.api.LiteAPI, java.lang.Class<T>)`
- `public abstract <T extends com.mumfrey.liteloader.api.Observer> java.util.List<T> getAllObservers(java.lang.Class<T>)`
- `public abstract java.util.List<? extends com.mumfrey.liteloader.api.Observer> getPreInitObservers(com.mumfrey.liteloader.api.LiteAPI)`
- `public abstract <T extends com.mumfrey.liteloader.api.Observer> java.util.List<T> getPreInitObservers(java.lang.Class<T>)`

### `com.mumfrey.liteloader.api.manager.APIProvider`

**Interface** `public interface com.mumfrey.liteloader.api.manager.APIProvider`

- `public static final java.util.regex.Pattern idAndRevisionPattern`
- `public abstract com.mumfrey.liteloader.api.LiteAPI[] getAPIs()`
- `public abstract boolean isAPIAvailable(java.lang.String)`
- `public abstract boolean isAPIAvailable(java.lang.String, int)`
- `public abstract com.mumfrey.liteloader.api.LiteAPI getAPI(java.lang.String)`
- `public abstract <T extends com.mumfrey.liteloader.api.LiteAPI> T getAPI(java.lang.Class<T>)`

### `com.mumfrey.liteloader.api.manager.APIRegistry`

**Class** `public final class com.mumfrey.liteloader.api.manager.APIRegistry`

- `public com.mumfrey.liteloader.api.manager.APIRegistry(com.mumfrey.liteloader.launch.LoaderEnvironment, com.mumfrey.liteloader.launch.LoaderProperties)`
- `public void registerAPI(java.lang.String) throws com.mumfrey.liteloader.api.exceptions.InvalidAPIStateException`
- `public java.lang.String[] getRegisteredAPIs()`
- `public com.mumfrey.liteloader.api.manager.APIProvider bake() throws com.mumfrey.liteloader.api.exceptions.InvalidAPIStateException`
- `public com.mumfrey.liteloader.api.manager.APIProvider getProvider() throws com.mumfrey.liteloader.api.exceptions.InvalidAPIStateException`
- `public com.mumfrey.liteloader.api.manager.APIAdapter getAdapter() throws com.mumfrey.liteloader.api.exceptions.InvalidAPIStateException`

## `com.mumfrey.liteloader.modconfig`（8 类）

### `com.mumfrey.liteloader.modconfig.AdvancedExposable`

**Interface** `public interface com.mumfrey.liteloader.modconfig.AdvancedExposable extends com.mumfrey.liteloader.modconfig.Exposable`

- `public abstract void setupGsonSerialiser(com.google.gson.GsonBuilder)`
- `public abstract java.io.File getConfigFile(java.io.File, java.io.File, java.lang.String)`

### `com.mumfrey.liteloader.modconfig.ConfigManager`

**Class** `public class com.mumfrey.liteloader.modconfig.ConfigManager`

- `public com.mumfrey.liteloader.modconfig.ConfigManager()`
- `public void registerMod(com.mumfrey.liteloader.LiteMod)`
- `public void registerExposable(com.mumfrey.liteloader.modconfig.Exposable, java.lang.String, boolean)`
- `public void migrateModConfig(com.mumfrey.liteloader.LiteMod, java.io.File, java.io.File)`
- `public boolean hasPanel(java.lang.Class<? extends com.mumfrey.liteloader.LiteMod>)`
- `public com.mumfrey.liteloader.modconfig.ConfigPanel getPanel(java.lang.Class<? extends com.mumfrey.liteloader.LiteMod>)`
- `public void initConfig(com.mumfrey.liteloader.modconfig.Exposable)`
- `public void invalidateConfig(com.mumfrey.liteloader.modconfig.Exposable)`
- `public void onTick()`
- `public void syncConfig()`
- `public static com.mumfrey.liteloader.modconfig.ConfigStrategy getConfigStrategy(com.mumfrey.liteloader.modconfig.Exposable)`

### `com.mumfrey.liteloader.modconfig.ConfigPanel`

**Interface** `public interface com.mumfrey.liteloader.modconfig.ConfigPanel`

- `public abstract java.lang.String getPanelTitle()`
- `public abstract int getContentHeight()`
- `public abstract void onPanelShown(com.mumfrey.liteloader.modconfig.ConfigPanelHost)`
- `public abstract void onPanelResize(com.mumfrey.liteloader.modconfig.ConfigPanelHost)`
- `public abstract void onPanelHidden()`
- `public abstract void onTick(com.mumfrey.liteloader.modconfig.ConfigPanelHost)`
- `public abstract void drawPanel(com.mumfrey.liteloader.modconfig.ConfigPanelHost, int, int, float)`
- `public abstract void mousePressed(com.mumfrey.liteloader.modconfig.ConfigPanelHost, int, int, int)`
- `public abstract void mouseReleased(com.mumfrey.liteloader.modconfig.ConfigPanelHost, int, int, int)`
- `public abstract void mouseMoved(com.mumfrey.liteloader.modconfig.ConfigPanelHost, int, int)`
- `public abstract void keyPressed(com.mumfrey.liteloader.modconfig.ConfigPanelHost, char, int)`

### `com.mumfrey.liteloader.modconfig.ConfigPanelHost`

**Interface** `public interface com.mumfrey.liteloader.modconfig.ConfigPanelHost`

- `public abstract <TModClass extends com.mumfrey.liteloader.LiteMod> TModClass getMod()`
- `public abstract int getWidth()`
- `public abstract int getHeight()`
- `public abstract void close()`

### `com.mumfrey.liteloader.modconfig.ConfigStrategy`

**Enum** `public final class com.mumfrey.liteloader.modconfig.ConfigStrategy extends java.lang.Enum<com.mumfrey.liteloader.modconfig.ConfigStrategy>`

枚举常量：`Unversioned` · `Versioned`

- `public static com.mumfrey.liteloader.modconfig.ConfigStrategy[] values()`
- `public static com.mumfrey.liteloader.modconfig.ConfigStrategy valueOf(java.lang.String)`
- `public java.io.File getFileForStrategy(java.lang.String)`

### `com.mumfrey.liteloader.modconfig.Exposable`

**Interface** `public interface com.mumfrey.liteloader.modconfig.Exposable`

_（无成员签名）_

### `com.mumfrey.liteloader.modconfig.ExposableConfigWriter`

**Class** `public final class com.mumfrey.liteloader.modconfig.ExposableConfigWriter implements com.google.gson.InstanceCreator<com.mumfrey.liteloader.modconfig.Exposable>`

- `public boolean isAggressive()`
- `public com.mumfrey.liteloader.modconfig.Exposable createInstance(java.lang.reflect.Type)`
- `public java.lang.Object createInstance(java.lang.reflect.Type)`

### `com.mumfrey.liteloader.modconfig.ExposableOptions`

**Annotation** `public interface com.mumfrey.liteloader.modconfig.ExposableOptions extends java.lang.annotation.Annotation`

- `public abstract com.mumfrey.liteloader.modconfig.ConfigStrategy strategy()`
- `public abstract java.lang.String filename()`
- `public abstract boolean aggressive()`

## 未核实 / 未覆盖

- 嵌套类型未抽（只取顶层类型；本构件内候选 71 个里，含 `$` 的内部类已排除）。
- 形参名与注解 `default` 值在构件里取不到（见上「计数」小节的三条限制）。
- 本文件**只**证明「构件里有这个名字与这个形状」，不证明它的行为、也不证明它在别的版本同样存在。
