# LiteLoader 1.8.9 已核实（极少）

来源：GitLab 分支 1.8.9 `HUDRenderListener.java`（2026-08-15 打开）。

| 接口 | 方法 |
|------|------|
| `com.mumfrey.liteloader.HUDRenderListener` | `onPreRenderHUD(int, int)`；`onPostRenderHUD(int, int)`；extends LiteMod |

其它接口：未核实、禁止输出。

## tick 钩子取证：**本轮受阻，如实记档（2026-10-04）**

桥路线（= 最小桥 mod，见 `mcp-server/src/generators/playtest-bridge-mod.ts`）只要求「该档 tick 钩子有出处」，**不要求 Gradle 载体**。
但本档的 tick 出处**本轮取不到**，三条独立证据：

1. **上游 GitLab 项目已 404**：`https://gitlab.com/api/v4/projects/mumfrey%2Fliteloader` → HTTP 404；
   `https://gitlab.com/mumfrey/liteloader/-/tree/1.8.9` → HTTP 403（**分支页实测于 1.8.9**；项目级 404 对全部分支成立，故 1.8.9 未单独再测）。
   ⇒ 上表记的取证来源（GitLab 分支 1.8.9）**今天不可达**。
2. **没有 GitHub 镜像**：`api.github.com/repos/Mumfrey/LiteLoader` → HTTP 404；`q=liteloader` 的仓库搜索前 20 名**全是 QQNT 项目**，无 MC LiteLoader。
3. **本仓无可用副本**：`liteloader/1.8.9/` 全树**无 jar**，亦无 `.java` 源；本档只有上表那一行。

**因此本档不得新增 tick 相关名字**（档内既有禁令不变：`Tickable` / `PluginChannelListener` 不在本档核实表内 ⇒ 禁止输出；**禁止把 1.12.2 整表抄来**）。

### 替代设计（**不是已核事实，是待验的设计判断**）

本档已核的 `HUDRenderListener`（`onPreRenderHUD(int,int)` / `onPostRenderHUD(int,int)`）是**渲染回调**。
在这些版本里客户端 tick 与渲染跑在**同一个主线程**上 ⇒ 用 `onPreRenderHUD` 当桥的「泵」（逐帧出队）在原理上可行。
**但这条没实测**，且它与 tick 语义不同（频率 = 帧率、不是 20Hz；缩到最小窗口 / 暂停时的行为未核）⇒ 走这条路必须先实测确认，
不得直接当成 tick 用。若实测成立，桥的「线程纪律」结论不变（仍是在客户端主线程上碰 MC）。
