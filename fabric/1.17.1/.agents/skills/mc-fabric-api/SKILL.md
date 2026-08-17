---
name: mc-fabric-api
description: Fabric API 模块系统。fabric-command-api、fabric-item-api、fabric-screen-api等模块。触发词：Fabric API、fabric-api、modImplementation、fabric-networking
platform: fabric
version: "1.17.1"
dependencies: []
mappings: yarn
---

# Fabric API 模块（Fabric 1.17.1）

## 概述

Fabric API 是模块化的官方扩展库，提供 20+ 独立模块。每个模块按需引入。

## 添加依赖

```groovy
// 引入完整 API（包含所有模块）
// ⚠️ 1.17.x 使用 net.fabricmc.fabric-api，不是 net.fabric.sdk
dependencies {
    modImplementation "net.fabricmc.fabric-api:fabric-api:0.46.1+1.17"
}

// 或选择性引入单个模块
dependencies {
    modImplementation "net.fabricmc.fabric-api:fabric-api-base:0.2.1+1.17.1"
    modImplementation "net.fabricmc.fabric-api:fabric-command-api-v1:1.1.0+1.17.1"
    modImplementation "net.fabricmc.fabric-api:fabric-networking-v0:0.3.4+1.17.1"
}
```

## 常用模块

### fabric-command-api-v1（命令系统）

```java
// 注册命令
CommandRegistrationCallback.EVENT.register((dispatcher, registryAccess) -> {
    dispatcher.register(
        LiteralArgumentBuilder.literal("mycommand")
            .then(ArgumentCommandBuilder.argument("player", EntityArgumentType.player())
                .executes(context -> {
                    PlayerEntity player = EntityArgumentType.getPlayer(context, "player");
                    player.sendMessage(Text.literal("Hello, " + player.getName().getString()), false);
                    return 1;
                })
            )
    );
});
```

### fabric-networking-v0（网络 API）

```groovy
modImplementation "net.fabricmc.fabric-api:fabric-networking-v0:0.3.4+1.17.1"
```

## 模块版本参考（1.17.1）

| 模块 | 版本 | 用途 |
|------|------|------|
| fabric-api-base | 0.2.1+1.17.1 | 基础工具类 |
| fabric-command-api-v1 | 1.1.0+1.17.1 | 命令注册 |
| fabric-networking-v0 | 0.3.4+1.17.1 | 网络通信 |
| fabric-object-builder-api-v1 | 1.0.0+1.17.1 | 对象构建器 |
| fabric-loot-api-v2 | 2.1.0+1.17.1 | Loot Table |
| fabric-key-bindings-v0 | 0.1.0+1.17.1 | 快捷键 API |
| fabric-screen-api-v1 | 1.0.0+1.17.1 | Screen 扩展 |

## 常见错误

- ❌ 引入不存在的模块版本 — 检查 Fabric API 版本兼容性
- ❌ `modImplementation` 用于需要传递的依赖 — API 应该用 `modApi`
- ❌ 忘记在 `fabric.mod.json` 的 `depends` 中声明 `fabric-api` — 运行时找不到 API
- ❌ 使用 `net.fabric.sdk` — 正确路径是 `net.fabricmc.fabric-api`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | Fabric API 扩展注册能力 |
| `mc-networking` | fabric-networking-v0 提供网络通信 |
| `mc-gui` | fabric-screen-api-v1 扩展 Screen |
