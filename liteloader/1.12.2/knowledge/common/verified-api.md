# LiteLoader 1.12.2 已核实客户端接口

- **抓取日**：
- **源**（上游未给开放许可，`All Rights Reserved`）：https://develop.liteloader.com/liteloader/LiteLoader 分支 `1.12.2`。`ll-src/` 已从 git 索引移除、只存在于本机工作区（`.gitignore` 排除），来源/版权/边界登记见根 `THIRD_PARTY_NOTICES.md` 的「LiteLoader 1.12.2 源码树」节；**不得再分发**，也不要把工作区副本读成许可授权。
- **构件 javap 复核**：真构件 `liteloader-1.12.2-SNAPSHOT.jar`（hybrid 工程 `deobfCompile` 解析件，本机 gradle 缓存；同目录有 sources jar）+ JDK21 `javap` 逐类实测。带「构件复核」的行 = 名字/签名出自构件本体，不再依赖源码腿。
- 表外禁止输出。不要用 Fabric `ServerPlayNetworking` 或 1.20 Payload。

## LiteMod / 生命周期（先前已核）

| 接口 | 方法 |
|------|------|
| `com.mumfrey.liteloader.LiteMod` | `getVersion()`；`init(File)`；`upgradeSettings(String, File, File)`（构件复核，签名逐字；extends `Exposable`, `api.Listener`） |
| `com.mumfrey.liteloader.api.Listener` | `getName()`（构件复核：**顶层 `com.mumfrey.liteloader.Listener` 在构件中不存在**——javap 报「找不到类」⇒ 旧行「Listener（及 api.Listener）」已订正） |
| `Tickable` | `onTick(Minecraft, float, boolean, boolean)`（构件复核，逐字） |
| `ChatFilter` / `ChatListener` | `boolean onChat(ITextComponent, String, ReturnValue<ITextComponent>)` / `void onChat(ITextComponent, String)`（构件复核，逐字） |
| `OutboundChatListener` | `onSendChatMessage(CPacketChatMessage, String)`（构件复核，逐字） |

## HUD / Render / Viewport（本次打开）

| 接口 | 方法 |
|------|------|
| `com.mumfrey.liteloader.HUDRenderListener` | `void onPreRenderHUD(int screenWidth, int screenHeight)`；`void onPostRenderHUD(int screenWidth, int screenHeight)`。**extends LiteMod**（构件复核） |
| `com.mumfrey.liteloader.RenderListener` | `void onRender()`；`void onRenderGui(GuiScreen currentScreen)`；`void onSetupCameraTransform()`。**extends LiteMod**（构件复核） |
| `com.mumfrey.liteloader.ViewportListener` | `void onViewportResized(ScaledResolution resolution, int displayWidth, int displayHeight)`；`void onFullScreenToggled(boolean fullScreen)`。**extends LiteMod**（构件复核） |

## 插件通道（本次打开）

| 接口 | 方法 |
|------|------|
| `com.mumfrey.liteloader.core.CommonPluginChannelListener` | `List<String> getChannels()`（构件复核：真形带泛型 `List<String>`，旧行只写 `List`）。注释：**不要直接实现本接口** |
| `com.mumfrey.liteloader.PluginChannelListener` | extends `LiteMod` + `CommonPluginChannelListener`；`void onCustomPayload(String channel, PacketBuffer data)`（构件复核，逐字） |

1.10.2 / 1.8.9 的 `HUDRenderListener` 方法名与 1.12.2 相同（源码腿；**两档各有真构件 javap 复核**，逐档见各档本文件）。其它接口引用仍只许来自各档核实表，禁止把本表当全版本百科。

`getName()` 归属复议（A-43，**登记**）：本表按分支实测记 **`Listener#getName()`**；`LiteMod` 实现类对它的覆写属**继承覆写**（`LiteMod` 系继承 `Listener` 线），与 scaffold `LiteModExample implements LiteMod, OutboundChatListener` 的 `@Override getName()` 不矛盾。上游 source jar 未全开（UNVERIFIABLE 面）——如后续打开更多分支再扩表；本条为**登记项，非缺陷**。**构件结论**：真构件中 `getName()` 只挂在 `com.mumfrey.liteloader.api.Listener`，顶层 `com.mumfrey.liteloader.Listener` 不存在 ⇒ 引用必须带 `api.` 包（scaffold 走 `LiteMod` 继承线，不受影响）。
