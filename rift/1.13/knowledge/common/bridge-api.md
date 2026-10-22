# bridge-api · rift 1.13 —— **本档不提供游玩测试桥**

## 为什么没有

桥需要 **MC 侧**（`net.minecraft.*`）的**真实名字**，而那些名字来自某个具体 MC 版本的映射。
`rift/1.13.2` 档的桥表是按 **forge 1.13.2** 的 `mcp_snapshot-20180921` 映射核的（43 个名字，`verified-api.md:4` 记了出处）。

**这套名字不能下移到 1.13**：1.13 → 1.13.2 之间 Mojang 重编过，notch 名与 MCP 名都有变动
（`rift/1.13.2/pack.meta.json` 的 gaps 里记着 21 个 hook mixin target 在 1.13.2 全部 not found，
反证了两版名字确实不同）。本档**没有**对 1.13 的映射面做核，所以：

- `BRIDGE_MOD_TARGETS` 里**没有** rift 1.13（见 `mcp-server/src/generators/playtest-bridge-mod.ts`）；
- 本档的 `listener` 用法只到 `knowledge/common/listeners.md` 的 Rift 侧方法；
- 要开桥，先补 1.13 的映射面（`data/forge_1.13/*` 之类）并逐名 javap，再登记。

## 未核实（别外推）

- 1.13 的 `net.minecraft.*` 类名/方法名：**未核**。
- Rift 1.13 上 `ClientTickable` 是否真的每 tick 被调：**要真机**（本档 `pack.meta.json:scaffold.buildVerified` 的读数就是这条）。
