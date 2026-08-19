---
name: mc-command
description: CommandManager.literal、权限、客户端命令。触发词：command、Brigadier、argument
platform: fabric
version: "1.19.4"
dependencies: []
mappings: yarn
---

# 命令（Fabric 1.19.4）

loader-api：`net.fabricmc.fabric.api.command.v2.CommandRegistrationCallback`。Yarn：`CommandManager.literal`。三参：dispatcher、`CommandRegistryAccess`、`CommandManager.RegistrationEnvironment`。

```java
CommandRegistrationCallback.EVENT.register((dispatcher, registryAccess, environment) -> {
    dispatcher.register(
        CommandManager.literal("test_command")
            .executes(ctx -> 1)
    );
});
```

不要抄 1.18 的两参 `(dispatcher, dedicated)`，不要抄 26.1.2 `Commands.literal` / `CommandSourceStack`。

## Decision Flow

```
IF 服务端命令
  → command.v2 三参 CommandRegistrationCallback + CommandManager.literal
IF 仅客户端
  → ClientCommandRegistrationCallback（client 源码）；核不到包名就停
```

## 常见错误

- ❌ command.v1 两参
- ❌ Mojmap `Commands` / `sendSuccess` 当本档 Yarn 必写名
