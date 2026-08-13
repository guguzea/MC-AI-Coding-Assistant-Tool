# 1.6.4 ModLoader 安全 API 表

来源：Risugami's ModLoader 公开 API + MCP 1.6.4 named（写规则时核对）。**表外禁止输出。**

## BaseMod（`mod_<Name> extends BaseMod`）

| 方法 | 说明 |
|------|------|
| `public String getVersion()` | 版本字符串 |
| `public void load()` | 加载期 |
| `public void modsLoaded()` | 全部 mod 已 load 之后 |
| `public String getName()` | 显示名（若实现） |

## ModLoader

| 方法 | 说明 |
|------|------|
| `ModLoader.addRecipe(ItemStack, Object...)` | 有序合成 |
| `ModLoader.addShapelessRecipe(ItemStack, Object...)` | 无序合成 |
| `ModLoader.addName(Object, String)` | 语言名 |
| `ModLoader.addLocalization(String, String)` | 本地化键 |
| `ModLoader.registerBlock(Block)` | 注册方块 |
| `ModLoader.registerBlock(Block, Class)` | 带 ItemBlock |
| `ModLoader.registerTileEntity(Class, String)` | TileEntity |
| `ModLoader.addSpawn(Class, int, int, int, EnumCreatureType)` | 生物生成 |
| `ModLoader.getUniqueEntityId()` | 实体网络 ID |
| `ModLoader.setInGameHook(BaseMod, boolean, boolean)` | 游戏内 tick 钩子 |
| `ModLoader.setInGUIHook(BaseMod, boolean, boolean)` | GUI 钩子 |

## 常用 Vanilla（MCP named，1.6.4）

`ItemStack`, `Block`, `Item`, `World`, `World.setBlock`, `World.getBlockId`

不在表内：停止生成，请补表或提供 `decompile_mod_jar` 缓存。
