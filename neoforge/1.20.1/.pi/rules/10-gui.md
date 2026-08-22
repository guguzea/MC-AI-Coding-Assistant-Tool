---
description: 10-gui NeoForge 1.20.1
globs:
alwaysApply: false
---

# 10 — GUI（NeoForge 1.20.1）

**mappingNote：** 本档是 Forge 兼容层（SimpleChannel 时代）。Menu / Screen / `IForgeMenuType` 与 Forge 1.20.1 同形态。**禁止**把 1.20.4+ `RegisterPayloadHandlersEvent` / Payload 当本档 GUI 同步。类名以 `search_neoforge_docs query=gui version=1.20.1` 核过的页为准。

## 决策

```
IF 可交互方块且有持久数据（机器、箱子）
  → AbstractContainerMenu + MenuType + Screen
IF 无数据的简单界面
  → 仅 Screen（不要 Menu）
IF 多槽物品栏
  → AbstractContainerMenu（quickMoveStack）
```

## MenuType

```java
public static final DeferredRegister<MenuType<?>> MENUS =
    DeferredRegister.create(ForgeRegistries.MENU_TYPES, MOD_ID);

public static final RegistryObject<MenuType<MyMenu>> MY_MENU =
    MENUS.register("my_menu", () -> IForgeMenuType.create(MyMenu::new));
```

- 服务端 `player.openMenu(MenuProvider)`；客户端 `MenuScreens.register` 只在 `FMLClientSetupEvent` / `Dist.CLIENT`
- `quickMoveStack` 必须实现，否则 Shift-点击无效
- `ContainerData` 只在服务端 `set`，客户端 `get`

## 常见错误

- 未注册 `MenuType` 就 `openMenu` → 崩溃
- 在服务端调 `MenuScreens.register`
- 在 Menu 构造里改世界状态（太早）
