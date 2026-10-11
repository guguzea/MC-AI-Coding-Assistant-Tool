# LiteLoader 1.10.2 已核实

来源：GitLab 分支 1.10.2 `HUDRenderListener.java`。

| 接口 | 方法 |
|------|------|
| `com.mumfrey.liteloader.HUDRenderListener` | `onPreRenderHUD(int, int)`；`onPostRenderHUD(int, int)`；extends LiteMod |

## 构件 javap 复核——整族接口已打通

**构件**：`liteloader-1.10.2.jar`，md5 `8a7c21f32d77ee08b393dd3921ced8eb`（取自 `dl.liteloader.com/versions/com/mumfrey/liteloader/1.10.2/`；与 versions.json 的 RELEASE 记录逐字一致）。本机留档：`F:\MC_GAME\_oracle-jars\liteloader\`。
⚠️ **本档发布件的 vanilla 参数类型是混淆名**（`bcx`/`ey`/`eq`/`bft`/`bdp`/`im` 等）⇒ 构件只证「类名 / 方法名 / 元数」，**vanilla 类型名一律不得据本构件写出**（本档无映射腿）。JDK21 `javap -p` 逐类实测：

| 接口（构件逐字） | 方法（构件逐字；vanilla 参数为混淆名） |
|------|------|
| `com.mumfrey.liteloader.LiteMod` | `getVersion()`；`init(File)`；`upgradeSettings(String, File, File)`（extends Exposable, api.Listener） |
| `com.mumfrey.liteloader.api.Listener` | `getName()`（⚠️ 顶层 `com.mumfrey.liteloader.Listener` **不存在**，javap「找不到类」） |
| `com.mumfrey.liteloader.Tickable` | `onTick(bcx, float, boolean, boolean)`；extends LiteMod |
| `com.mumfrey.liteloader.PluginChannelListener` | `onCustomPayload(String, eq)`；extends LiteMod + `core.CommonPluginChannelListener` |
| `com.mumfrey.liteloader.ChatFilter` / `ChatListener` | `boolean onChat(ey, String, ReturnValue<…>)` / `void onChat(ey, String)` |
| `com.mumfrey.liteloader.OutboundChatListener` | `onSendChatMessage(im, String)` |
| `com.mumfrey.liteloader.RenderListener` | `onRender()` / `onRenderGui(bft)` / `onSetupCameraTransform()` |
| `com.mumfrey.liteloader.ViewportListener` | `onViewportResized(bdp, int, int)` / `onFullScreenToggled(boolean)` |
| `com.mumfrey.liteloader.core.CommonPluginChannelListener` | `List<String> getChannels()` |

⇒ **tick 钩子出处已取得**（上表 `Tickable` 行）；的「不得新增 tick 相关名字」禁令据此**解除**。仍禁止把 1.12.2 文件整表照抄——引用只许来自本表与本节构件清单。运行行为（tick 频率、线程纪律）仍属实测面，未实测就标未实测。

### 历史记录（已被上节取代）

源码腿三条证据当时全断（GitLab API 404、无 GitHub 镜像、本仓无副本）⇒ 当时记「不得新增 tick 相关名字」，并以 `onPreRenderHUD` 逐帧出队作替代设计（**未实测**）。构件腿打通后：名字禁令解除；泵方案降为备选（`Tickable` 语义更贴 tick 且已由构件证实存在）。
