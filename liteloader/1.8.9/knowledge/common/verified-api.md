# LiteLoader 1.8.9 已核实

来源：GitLab 分支 1.8.9 `HUDRenderListener.java`。

| 接口 | 方法 |
|------|------|
| `com.mumfrey.liteloader.HUDRenderListener` | `onPreRenderHUD(int, int)`；`onPostRenderHUD(int, int)`；extends LiteMod |

## 构件 javap 复核——整族接口已打通

**构件**：`liteloader-1.8.9-20160414.153538-10.jar`，md5 `12cbdc8c16de3552a2efa3582aa37738`（取自 `repo.mumfrey.com/content/repositories/snapshots/com/mumfrey/liteloader/1.8.9-SNAPSHOT/`，与仓库同名 `.md5` 逐字一致）。1.8.9 只有 SNAPSHOT 流（versions.json（2016）钉的 latest = build 8，与本机 build 10 同谱系）。本机留档：`F:\MC_GAME\_oracle-jars\liteloader\`。
本档构件是 **MCP 可读名**；JDK21 `javap -p` 逐类实测：

| 接口（构件逐字） | 方法 |
|------|------|
| `com.mumfrey.liteloader.LiteMod` | `getVersion()`；`init(File)`；`upgradeSettings(String, File, File)`（extends Exposable, api.Listener） |
| `com.mumfrey.liteloader.api.Listener` | `getName()`（⚠️ 顶层 `com.mumfrey.liteloader.Listener` **不存在**，javap「找不到类」） |
| `com.mumfrey.liteloader.Tickable` | `onTick(net.minecraft.client.Minecraft, float, boolean, boolean)`；extends LiteMod |
| `com.mumfrey.liteloader.PluginChannelListener` | `onCustomPayload(String, net.minecraft.network.PacketBuffer)`；extends LiteMod + `core.CommonPluginChannelListener` |
| `com.mumfrey.liteloader.ChatFilter` / `ChatListener` | `boolean onChat(IChatComponent, String, ReturnValue<IChatComponent>)` / `void onChat(IChatComponent, String)` |
| `com.mumfrey.liteloader.OutboundChatListener` | `onSendChatMessage(C01PacketChatMessage, String)` |
| `com.mumfrey.liteloader.RenderListener` | `onRender()` / `onRenderGui(GuiScreen)` / `onSetupCameraTransform()` |
| `com.mumfrey.liteloader.ViewportListener` | `onViewportResized(ScaledResolution, int, int)` / `onFullScreenToggled(boolean)` |
| `com.mumfrey.liteloader.core.CommonPluginChannelListener` | `List<String> getChannels()` |

⇒ **tick 钩子出处已取得**（上表 `Tickable` 行）；的「不得新增 tick 相关名字」禁令据此**解除**。仍禁止把 1.12.2 文件整表照抄——引用只许来自本表与本节构件清单。运行行为（tick 频率、线程纪律）仍属实测面，未实测就标未实测。

### 历史记录（已被上节取代）

源码腿三条证据当时全断（GitLab API 404、无 GitHub 镜像、本仓无副本）⇒ 当时记「不得新增 tick 相关名字」，并以 `onPreRenderHUD` 逐帧出队作替代设计（**未实测**）。构件腿打通后：名字禁令解除；泵方案降为备选（`Tickable` 语义更贴 tick 且已由构件证实存在）。
