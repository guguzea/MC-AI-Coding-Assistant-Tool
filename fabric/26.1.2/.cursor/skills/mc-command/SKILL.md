---
name: mc-command
description: Fabric 26.1.2 命令。CommandRegistrationCallback、Commands.literal、CommandSourceStack。触发词：命令、Brigadier、CommandRegistrationCallback
platform: fabric
version: "26.1.2"
dependencies: []
mappings: official
---

# 命令（Fabric 26.1.2）

文档：`26.1.2/develop_commands_basics`。Mojmap。不要 Yarn `CommandManager` / `EntityArgumentType` / `ServerCommandSource`。

## 快速开始

在 **common initializer** 里注册。回调三参（loader-api 已核）：

- `CommandDispatcher<CommandSourceStack> dispatcher`
- `CommandBuildContext registryAccess`
- `Commands.CommandSelection environment`

```java
CommandRegistrationCallback.EVENT.register((dispatcher, registryAccess, environment) -> {
    dispatcher.register(
        Commands.literal("test_command")
            .executes(ctx -> {
                ctx.getSource().sendSuccess(() -> Component.literal("Hello"), false);
                return Command.SINGLE_SUCCESS;
            })
    );
});
```

- 成功返回正整数；官方用 `Command.SINGLE_SUCCESS`
- `sendSuccess` 第一参是 `Supplier<Component>`（1.20+），第二参是否广播给其他管理员
- 用 `Commands.literal` / `Commands.argument`，不要 `LiteralArgumentBuilder.literal`

仅专用服：判断 `environment`（文档 dedicated 示例）。权限：`.requires(source -> source.hasPermission(2))` 一类 `Predicate<CommandSourceStack>`。

## 客户端命令

`ClientCommandRegistrationCallback`（`net.fabricmc.fabric.api.client.command.v2`），只放客户端源码。用 `ClientCommands`，不要抄服务端 `Commands` 进 client 包。

## Decision Flow

```
IF 服务端命令
  → CommandRegistrationCallback.EVENT.register + Commands.literal
IF 仅客户端
  → ClientCommandRegistrationCallback（client 源码）
IF 子命令 / 别名
  → 往已有 literal 上 append；无参 redirect 必须再写 .executes()
IF 运行时动态注册
  → 文档不推荐；若做，还要 Commands.sendCommands(ServerPlayer)
```

## 常见错误

- ❌ 不捕获/不声明 `CommandSyntaxException`（它不是 RuntimeException）
- ❌ `sendSuccess` 少 boolean，或第一参仍传 `Component` 而不是 `Supplier`
- ❌ `.executes()` lambda 不返回 int
- ❌ Yarn 名抄进本档

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 参数里引用已注册物 |
| `mc-entity` | `EntityArgument.player()`（Mojmap） |
| `mc-networking` | 命令里发 CustomPacketPayload |
