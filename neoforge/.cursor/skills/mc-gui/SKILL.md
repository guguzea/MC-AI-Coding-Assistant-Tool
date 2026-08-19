---
name: mc-gui
description: Minecraft NeoForge GUI。按精确版本读 neoforge/<ver>/.cursor/rules/10-gui.mdc，不要把本扁平 Skill 当 1.20.4 全文。触发词：Screen、Menu、MenuType、RegisterMenuScreensEvent、quickMoveStack、IContainerFactory、ContainerData、DataSlot
platform: neoforge
version: ""
dependencies: []
mappings: mojmap
---

# GUI/菜单（扁平索引，不是某一档教程）

扁平 `neoforge/.cursor` **不再是 1.20.4 教程**。先 `list_neoforge_versions` 锁定版本，再读 `neoforge/<ver>/.cursor/rules/10-gui.mdc` 与 `mc-gui`。

| 版本 | Screen 注册（官方 / loader-api） | 打开菜单 |
|---|---|---|
| 1.20.4 | `RegisterMenuScreensEvent`（官方 screens 页） | 官方 menus：`NetworkHooks.openScreen` |
| 1.21.1 / 1.21.3 / 1.21.8 | 同上事件 | `IPlayerExtension#openMenu` / `serverPlayer.openMenu` |
| 1.21.11 / 26.1 | 同上事件（gui 专页 404，以 loader-api 为准） | 同上 `openMenu` |

**不要**在 NeoForge 工程写 `MenuScreens.register`（那是 Forge 1.20.1 官方 screens 页 + `FMLClientSetupEvent#enqueueWork` 的写法）。**不要**把 1.20.4 的 `NetworkHooks` 抄进 1.21.1+。

## Decision: 是否需要 Menu

```
IF 交互时需要持久数据存储（机器进度、箱子物品）
  → 使用 AbstractContainerMenu + MenuType + Screen

IF 只是显示 UI（无数据）
  → 直接使用 Screen（无需 Menu）

IF 需要物品栏槽位（多格容器）
  → AbstractContainerMenu（slot 管理 + quickMoveStack）
```

MenuType 用 `DeferredRegister<MenuType<?>>`（菜单实例不是 registry object）。本档不要用 Forge `RegistryObject` 当教程类型。

## 常见错误

- ❌ `RegisterMenuScreensEvent` 写到服务端 / 游戏总线
- ❌ `quickMoveStack` 返回空导致物品丢失 → 始终实现完整的转移逻辑
- ❌ 方块 `getMenuProvider` 返回 null 却直接打开
- ❌ 在 Menu 构造函数中直接修改世界数据
- ❌ `stillValid()` 始终返回 true 且不做距离检查（官方常用 `AbstractContainerMenu.stillValid(access, player, block)`）

## 参考资料

- 分档规则：`neoforge/<ver>/.cursor/rules/10-gui.mdc`
- 1.20.4 官方：https://docs.neoforged.net/docs/1.20.4/gui/menus/ 与 `/gui/screens/`
- 1.21.1 官方：https://docs.neoforged.net/docs/1.21.1/gui/menus/ 与 `/gui/screens/`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | MenuType 用 DeferredRegister |
| `mc-item` | 物品栏槽位中的 ItemStack 交互 |
| `mc-networking` | extra data / 自定义同步走该版 Payload，禁止 SimpleChannel |
