---
name: mc-fabric-api
description: Fabric API 模块系统。fabric-command-api、fabric-item-api、fabric-screen-api等20+模块。触发词：Fabric API、fabric-api、modImplementation、fabric-networking
platform: fabric
version: "1.18.2"
dependencies: []
mappings: yarn
---

# Fabric API 模块（Fabric 1.18.2）

## 概述

Fabric API 是模块化的官方扩展库，提供 20+ 独立模块。每个模块按需引入。

## 添加依赖

```groovy
// 引入完整 API（包含所有模块）
dependencies {
    modImplementation "net.fabricmc.fabric-api:fabric-api:0.77.0+1.18.2"
}

// 或选择性引入单个模块
dependencies {
    modImplementation "net.fabricmc.fabric-api:fabric-api-base:0.4.29+1.18.2"
    modImplementation "net.fabricmc.fabric-api:fabric-command-api-v2:2.2.11+1.18.2"
    modImplementation "net.fabricmc.fabric-api:fabric-networking-api-v1:1.3.8+1.18.2"
    modImplementation "net.fabricmc.fabric-api:fabric-screen-api-v1:2.2.7+1.18.2"
}
```

## 常用模块

### fabric-command-api-v2（命令系统）

```java
// 注册命令
CommandRegistrationCallback.EVENT.register((dispatcher, registryAccess) -> {
    dispatcher.register(
        LiteralArgumentBuilder.literal("mycommand")
            .then(ArgumentCommandBuilder.argument("player", EntityArgumentType.player())
                .executes(context -> {
                    PlayerEntity player = EntityArgumentType.getPlayer(context, "player");
                    player.sendMessage(Text.literal("Hello, " + player.getName().getString()));
                    return 1;
                })
            )
    );
});
```

### fabric-item-api-v1（物品 API）

```java
// 检查物品是否可堆叠到某物品栏
if (FabricItemApi.INSTANCE.canStack(ItemStack.EMPTY, inventory)) {
    // ...
}
```

### fabric-screen-api-v1（Screen API）

```groovy
modImplementation "net.fabricmc.fabric-api:fabric-screen-api-v1:9.1.1+1.18.2"
```

### fabric-networking-api-v1（网络 API）

```groovy
modImplementation "net.fabricmc.fabric-api:fabric-networking-api-v1:1.3.8+1.18.2"
```

### fabric-object-builder-api-v1（对象构建器）

```java
// 使用 ObjectBuilder 创建复杂对象
public class MyBuilder {
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private int value;
        public Builder value(int v) { this.value = v; return this; }
        public MyObject build() { return new MyObject(value); }
    }
}
```

### fabric-loot-api-v2（Loot Table API）

```groovy
modImplementation "net.fabricmc.fabric-api:fabric-loot-api-v2:2.1.0+1.18.2"
```

### fabric-registry-sync-v0（Registry 同步）

用于同步自定义 Registry。

### fabric-keybindings-api-v1（快捷键 API）

```groovy
modImplementation "net.fabricmc.fabric-api:fabric-key-bindings-v0:1.0.0+1.18.2"
```

## 模块版本参考（1.18.2）

| 模块 | 版本 | 用途 |
|------|------|------|
| fabric-api-base | 0.4.29+1.18.2 | 基础工具类 |
| fabric-command-api-v2 | 2.2.11+1.18.2 | 命令注册 |
| fabric-networking-api-v1 | 1.3.8+1.18.2 | 网络通信 |
| fabric-screen-api-v1 | 2.2.7+1.18.2 | Screen 扩展 |
| fabric-item-api-v1 | 1.5.3+1.18.2 | 物品 API |
| fabric-object-builder-api-v1 | 1.0.1+1.18.2 | 对象构建器 |
| fabric-loot-api-v2 | 2.1.0+1.18.2 | Loot Table |
| fabric-datagen-api-v0 | 4.2.1+1.18.2 | 数据生成 |
| fabric-rendering-v0 | 1.1.33+1.18.2 | 渲染基础 |
| fabric-renderer-api-v1 | 2.2.0+1.18.2 | 渲染 API |

## 常见错误

- ❌ 引入不存在的模块版本 — 检查 Fabric API 版本兼容性
- ❌ `modImplementation` 用于需要传递的依赖 — API 应该用 `modApi`
- ❌ 忘记在 `fabric.mod.json` 的 `depends` 中声明 `fabric-api` — 运行时找不到 API

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | Fabric API 扩展注册能力 |
| `mc-networking` | fabric-networking-api-v1 提供高级网络 |
| `mc-gui` | fabric-screen-api-v1 扩展 Screen |
