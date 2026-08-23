---
id: authored/custom-commands-brigadier
title: 自定义命令（Brigadier）注册与参数树
tags: [commands, brigadier, RegisterCommandsEvent, literal, argument, forge, neoforge]
summary: RegisterCommandsEvent 注册；literal/argument 树、executes 与返回码；常用 ArgumentType 与 suggestion；权限 requires；服务端执行与 sendSuccess lambda；PlayerEvent.Clone 持久化配合。
mcHint: 1.20.1+（NeoForge 同构，事件类换 net.neoforged 包）
sourceKind: authored
---

# 自定义命令（Brigadier）注册与参数树

自写短文。要点依据 Kaupenjoe Forge 课程 commands 章（分支 `33-commands`）+ NeoForge 官方文档概念核对。

## 注册入口

命令不是 DeferredRegister 注册表，而是**事件注册**：`RegisterCommandsEvent`（每次服务端启动/数据包 reload 时重建 dispatcher）。

```java
@Mod.EventBusSubscriber(modid = MOD_ID) // NeoForge: net.neoforged.fml.common.EventBusSubscriber / modid 参数位置不同
public class ModCommands {
    @SubscribeEvent
    public static void onCommandsRegister(RegisterCommandsEvent event) {
        ReturnHomeCommand.register(event.getDispatcher());
    }
}
```

- Forge 1.20.1：`net.minecraftforge.event.RegisterCommandsEvent`；NeoForge：`net.neoforged.neoforge.event.RegisterCommandsEvent`。
- dispatcher 类型是 Brigadier 的 `CommandDispatcher<CommandSourceStack>`。
- 教程用「构造函数里 register」的写法；等价惯用静态方法 `register(dispatcher)`，二选一保持项目一致。

## 命令树：literal + argument + executes

```java
dispatcher.register(Commands.literal("home")
    .requires(src -> src.hasPermission(0))          // 可选：权限门槛
    .then(Commands.literal("set").executes(this::executeSet))
    .then(Commands.literal("return")
        .then(Commands.argument("keepArmor", BoolArgumentType.bool())
            .executes(ctx -> executeReturn(ctx, BoolArgumentType.getBool(ctx, "keepArmor"))))));
```

- `executes` 挂在**叶子节点**上；中间节点没有 executes 时，只输入到该层会走原版帮助/报错。
- 执行体返回 **int 结果码**（`/execute store` 等可见）：成功惯例返回 1，失败返回 0 或 -1 并配 `sendFailure`。

## 常用 ArgumentType

| 需求 | ArgumentType | 取值 |
|------|--------------|------|
| 整数 / 范围 | `IntegerArgumentType.integer(0, 100)` | `getInteger(ctx, name)` |
| 浮点 | `FloatArgumentType.floatArg()` | `getFloat` |
| 布尔 | `BoolArgumentType.bool()` | `getBool` |
| 字符串 | `StringArgumentType.word()/string()/greedyString()` | `getString` |
| 方块位置 | `BlockPosArgument.blockPos()` | `BlockPosArgument.getBlockPos(ctx, name)`（需 `CommandSourceStack` 有 level） |
| 实体/玩家 | `EntityArgument.player()`, `.entities()` | `EntityArgument.getPlayer(ctx, name)` 等 |
| 物品/方块 | `ItemArgument.item()`, `BlockStateArgument.block()` | `.getItem(ctx)` / `.getState(ctx)` |
| ResourceLocation | `ResourceLocationArgument.id()` | `ResourceLocationArgument.getId(ctx, name)` |

- 参数名就是字符串 key，取值时必须同名。
- `greedyString` 会吞掉后面所有空格内容，只能放最后一个参数。

## 补全与错误信息

- 参数建议：`.suggests((ctx, builder) -> SharedSuggestionProvider.suggest(List.of("a","b"), builder))`；枚举场景也可用自定义 `SuggestionProvider`。
- 输入非法时 Brigadier 自动报错；运行期业务失败手动：

```java
context.getSource().sendSuccess(() -> Component.literal("ok!"), true);  // broadcast=true 广播给其他 op
context.getSource().sendFailure(Component.literal("no home set"));
```

- `sendSuccess` 接收 **`Supplier<Component>`**（1.19.4+ 懒求值），不要传 Component 本体。

## 服务端边界

- 命令执行体永远在**服务端**跑；`context.getSource().getPlayerOrException()` 拿 ServerPlayer。
- 不要在命令里直接碰客户端类（Screen/Minecraft）；要开 GUI 走网络包。

## 配合玩家持久化（教程实例：sethome）

教程把家坐标写进 `player.getPersistentData()`（`CompoundTag`，key 带 mod id 前缀如 `"mccourse.homepos"`）。注意两点：

- persistentData **不随死亡保留**：需要监听 `PlayerEvent.Clone` 把 `event.getOriginal().getPersistentData()` 拷回新实体（见下篇 SavedData 短文的取舍对比）。
- 只在本 mod 内读写的临时标记适合 persistentData；跨重启的世界级数据应改用 SavedData。

## 自检

- `/help` 或补全里能看到命令；无权限者看不到被 `requires` 过滤的节点。
- 单人 + 专用服各测一遍；带参数命令测非法输入报错文案。
- 返回码：`/execute store result` 验证成功路径返回 1。

## 不清楚时

- 教程源码（分支 `33-commands`，MIT）：https://github.com/kaupenjoe/Forge-Course-1.20.X/tree/33-commands
- Brigadier 官方仓库（参数类型以源码为准）：https://github.com/Mojang/brigadier
- API 细节：`search_forge_docs` / `search_neoforge_docs`（关键词 commands）、`query_api`（仅 Vanilla 类）
