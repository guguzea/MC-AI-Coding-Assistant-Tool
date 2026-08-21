---
name: mc-fabric-api
description: Fabric API 模块系统。fabric-command-api-v2、内容注册表、networking。触发词：Fabric API、fabric-api、modImplementation、fabric-networking
platform: fabric
version: "1.19.4"
dependencies: []
mappings: yarn
---

# Fabric API 模块（Fabric 1.19.4）

## 概述

Fabric API 是模块化的官方扩展库。日常开发引入 **完整 `fabric-api`** 即可；模块名只作对照，**不要钉死**过期的单模块版本号。

## 添加依赖

```groovy
dependencies {
    modImplementation "net.fabricmc.fabric-api:fabric-api:${project.fabric_api_version}"
}
```

`fabric_api_version` 写在 `gradle.properties`，与当前 Minecraft 匹配。不要用 `net.fabric.sdk:`。需要传递给其它 mod 时再用 `modApi`。

## 常用模块

### fabric-command-api-v2（命令系统）

```java
CommandRegistrationCallback.EVENT.register((dispatcher, registryAccess, environment) -> {
    dispatcher.register(
        CommandManager.literal("mycommand")
            .then(CommandManager.argument("player", EntityArgumentType.player())
                .executes(ctx -> {
                    ServerPlayerEntity player = EntityArgumentType.getPlayer(ctx, "player");
                    player.sendMessage(Text.literal("Hello"), false);
                    return 1;
                }))
    );
});
```

不要 `ArgumentCommandBuilder`。v2 回调是三参 `(dispatcher, registryAccess, environment)`。

### 内容注册表（燃料 / 堆肥）

```java
FuelRegistry.INSTANCE.add(MY_ITEM, 200);
CompostingChanceRegistry.INSTANCE.add(MY_ITEM, 0.3f);
```

不要 `FabricItemApi.INSTANCE.canStack`（编造）。自定义物品行为用 `FabricItem` 接口（若本版模块有），不要假单例。

### fabric-screen-api / GUI

Screen 注册与额外数据见 `10-gui.mdc` / `mc-gui`。不要在这里抄邻版 `ScreenRegistry` 或 `HandledScreens` 而不对版本。

### fabric-networking-api-v1

包注册与收发见 `06-networking.mdc` / `mc-networking`。不要把 1.21 的 `PayloadTypeRegistry` 抄到 1.20.4 及更早，也不要把 26.1 Mojmap 抄到 Yarn 档。

### fabric-object-builder-api-v1

```java
new Block(FabricBlockSettings.of().strength(1.5f, 6.0f));
new Item(new FabricItemSettings());
```

不要编造与游戏无关的 `MyBuilder` 当本模块教程。

### 战利品 API

fabric-loot-api-v2（`LootTableEvents`，见 `05-events.mdc`）

### fabric-registry-sync-v0

用于同步自定义 Registry。

### fabric-key-binding-api-v1

快捷键见 `KeyBindingHelper`（以本版 loader-api 为准），不要钉死 `fabric-key-bindings-v0:1.0.0+1.20.1`。

## 模块名备忘（1.19.4）

| 模块 | 用途 |
|------|------|
| fabric-api-base | 基础工具 |
| fabric-command-api-v2 | 命令注册 |
| fabric-networking-api-v1 | 网络通信 |
| fabric-object-builder-api-v1 | 方块/物品/实体设置 helper |
| fabric-datagen-api-v0 | 数据生成（1.17+；1.14/1.16 无） |
| fabric-renderer-api-v1 | 渲染 API |

版本号随 `fabric-api` BOM，不要在规则里写死 `0.4.29+1.20.1` 这种邻版数字。

## 常见错误

- ❌ 引入不存在的模块版本 — 以 `gradle.properties` 的 fabric-api 为准
- ❌ group 写成 `net.fabric.sdk` — 正确是 `net.fabricmc.fabric-api`
- ❌ 忘记在 `fabric.mod.json` 的 `depends` 中声明 `fabric-api`
- ❌ `ArgumentCommandBuilder` / `FabricItemApi` — 编造 API

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | Fabric API 扩展注册能力 |
| `mc-networking` | fabric-networking-api-v1 |
| `mc-gui` | Screen / Menu |
