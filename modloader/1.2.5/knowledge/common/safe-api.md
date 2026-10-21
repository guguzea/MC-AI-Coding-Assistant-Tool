# 1.2.5 安全 API

本档仍**不出正表**（未打开 MCP 1.2.5 named；禁止用 1.6.4 表顶上）。但 **有官方发布物可核** —— 见下。

## 构件 javap 复核——官方 zip 已入库

**构件**：`ModLoader 1.2.5.zip`（mcarchive 官方归档；本机留档 `<本地构件留档>\modloader\`，1.6.2 / 1.5.2 同批（维护机路径不入库；按 mcarchive 官方 zip 名自取））+ JDK21 `javap` 实测（`BaseMod.class` / `ModLoader.class`）：

| 接口（构件逐字） | 方法 |
|------|------|
| `BaseMod.onTickInGame` | `public boolean onTickInGame(float, net.minecraft.client.Minecraft)`（本档构件第二参是**可读名**） |
| `BaseMod.onTickInGUI` | `public boolean onTickInGUI(float, net.minecraft.client.Minecraft, vp)` |
| `ModLoader.getMinecraftInstance` | `public static net.minecraft.client.Minecraft getMinecraftInstance()`（**客户端单例取法，构件实证**） |
| `ModLoader.setInGameHook` / `setInGUIHook` | `(BaseMod, boolean, boolean)` |
| `ModLoader.addRecipe` / `addShapelessRecipe` | `(aan, Object...)`（`aan` = 混淆 ItemStack 位） |
| `ModLoader.addSpawn` | `(Class<? extends acq>, int, int, int, acf[, abn...])`（**biome 参数是本档特有的可变参形**） |
| `ModLoader.registerBlock` / `registerTileEntity`(+第三参) / `addName` / `addLocalization` | 均在（vanilla 参数为混淆名） |
| `ModLoader.getUniqueEntityId` | ✅ **本档构件有**：`public static int getUniqueEntityId()`（1.5.2 / 1.6.2 已删——本线独有） |
| `BaseMod` 聊天/包回调 | 本档线名字与 1.5.2+ 不同：`receiveChatPacket(String)` / `receiveCustomPacket(ee)`、`serverConnect(adl)` / `serverDisconnect()` |

⚠️ 除上表明确可读的少数名字外，构件里 vanilla 参数均为混淆名 ⇒ **vanilla 类型名不得据本构件写出**（本档无 mapping 腿）。

## 桥路线可行性核对（更新；原文三条判据的①已作废）

1. ~~**tick 钩子无出处**~~ → **已取得**：`BaseMod.onTickInGame(float, Minecraft)` + `ModLoader.setInGameHook`（上表构件实证）。原文「1.2.5 / 1.5.2 的官方发布件没有稳定可核落点」**已被推翻**（mcarchive 存官方 zip，实取 + javap）。
2. **MC 侧其余接口仍缺**：玩家对象 / 位置字段、发聊天、截图、读方块签名（**客户端单例已解决** = `ModLoader.getMinecraftInstance()`）；要补须自备 MCP 1.2.5 named（本档仍没有）。
3. **无 Gradle 载体**（MCP + Eclipse 形态）⇒ 即便有出处，也只能走「手工 javac + 打 jar + 人工装」，本仓不代跑。

**结论**：出处面比此前 好了一档（tick 与客户端单例可写死），但**要真跑起来仍须自备 MCP 1.2.5 工作区补 MC 侧字段名 + 手工装**；不做的前提下，替代路线（离线解析存档 region/NBT + 人工驱动）仍更划算 —— 见社区短文坑 74 / 坑 75。
