# LiteLoader 1.12.2 已核实客户端接口

- **抓取日**：2026-08-15
- **源**（只作本地参考，许可证禁止把 loader 源码再分发进本仓库）：http://develop.liteloader.com/liteloader/LiteLoader 分支 `1.12.2`
- 表外禁止输出。不要用 Fabric `ServerPlayNetworking` 或 1.20 Payload。

## LiteMod / 生命周期（先前已核）

| 接口 | 方法 |
|------|------|
| `com.mumfrey.liteloader.LiteMod` | `getVersion()`；`init(File)`；`upgradeSettings(...)` |
| `com.mumfrey.liteloader.Listener`（及 api.Listener） | `getName()` |
| `Tickable` | `onTick(Minecraft, float, boolean, boolean)` |
| `ChatFilter` / `ChatListener` | `onChat(...)` |
| `OutboundChatListener` | `onSendChatMessage(CPacketChatMessage, String)` |

## HUD / Render / Viewport（本次打开）

| 接口 | 方法 |
|------|------|
| `com.mumfrey.liteloader.HUDRenderListener` | `void onPreRenderHUD(int screenWidth, int screenHeight)`；`void onPostRenderHUD(int screenWidth, int screenHeight)`。**extends LiteMod** |
| `com.mumfrey.liteloader.RenderListener` | `void onRender()`；`void onRenderGui(GuiScreen currentScreen)`；`void onSetupCameraTransform()`。**extends LiteMod** |
| `com.mumfrey.liteloader.ViewportListener` | `void onViewportResized(ScaledResolution resolution, int displayWidth, int displayHeight)`；`void onFullScreenToggled(boolean fullScreen)`。**extends LiteMod** |

## 插件通道（本次打开）

| 接口 | 方法 |
|------|------|
| `com.mumfrey.liteloader.core.CommonPluginChannelListener` | `List getChannels()`。注释：**不要直接实现本接口** |
| `com.mumfrey.liteloader.PluginChannelListener` | extends `LiteMod` + `CommonPluginChannelListener`；`void onCustomPayload(String channel, PacketBuffer data)` |

1.10.2 / 1.8.9 的 `HUDRenderListener` 方法名与 1.12.2 相同（已打开对应分支）。其它接口仍须打开该分支源码，禁止把本表当全版本百科。
