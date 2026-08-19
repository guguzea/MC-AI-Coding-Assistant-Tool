---
name: mc-command
description: CommandManager.literal、权限、客户端命令。触发词：command、Brigadier、argument
platform: fabric
version: "1.17.1"
dependencies: []
mappings: yarn
---

# 命令（Fabric 1.17.1）

loader-api：`net.fabricmc.fabric.api.command.v1.CommandRegistrationCallback`。Yarn：`CommandManager.literal`、`ServerCommandSource`。两参：`CommandDispatcher<ServerCommandSource>` + `boolean dedicated`。

```java
CommandRegistrationCallback.EVENT.register((dispatcher, dedicated) -> {
    dispatcher.register(
        CommandManager.literal("test_command")
            .executes(ctx -> 1)
    );
});
```

不要抄 1.19+ 三参 `CommandRegistrationCallback`（command.v2），也不要抄 26.1.2 Mojmap `Commands.literal` / `CommandSourceStack`。

## Decision Flow

```
IF 服务端命令
  → command.v1 CommandRegistrationCallback（dispatcher, dedicated）
IF 仅客户端
  → 先核本版是否有 client command API；核不到就停
```

## 常见错误

- ❌ command.v2 三参 lambda
- ❌ Mojmap `Commands.literal`
