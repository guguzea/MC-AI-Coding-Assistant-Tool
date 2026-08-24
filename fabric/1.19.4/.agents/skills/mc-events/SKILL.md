---
name: mc-events
description: Fabric 1.19.4 事件系统。Event 回调、onInitialize 注册、本档版本差异。触发词：事件、Event、Callback、TickEvents、onInitialize
platform: fabric
version: "1.19.4"
dependencies: []
mappings: yarn
docsTool: search_fabric_docs
---

# mc-events（Fabric 1.19.4）

> 正文逐条来自本档 `.cursor/rules/05-events.mdc`（该档已核实口径）；本 Skill 不引入规则之外的 API 名。

## 核心原则

- Fabric 用**事件回调**（静态 `Event` 字段 + `.register(lambda)`），不是 Forge 的 `@SubscribeEvent` / `@EventHandler`；在 `onInitialize()` / `onInitializeClient()` 里注册（初始化时注册，逻辑放进 lambda，禁止「有时才 register」）。
- 与 Forge 的映射：`MinecraftForge.EVENT_BUS` → 各事件类型的静态 `Event` 字段；`EventPriority` → Fabric **Phase**；`event.setCanceled(true)` → 返回 `ActionResult` / `TypedActionResult` / `boolean`。
- 禁编名单（非本档 Fabric API）：`ItemEvents` / `BlockEvents` / `EntityEvents` / `PlayerTickEvents` / `EntityTickEvents` / `AttackEvents`，以及 `ActionResult.PISTON`、`CallbackEvaluator`、`DataPackRegistry`、`AttackEvents.AFTER_DAMAGE`。
- 模块：事件在 `fabric-api` 聚合依赖内（`fabric-events-interaction-v0`、`fabric-lifecycle-events-v1` 等），不要写 `net.fabric.sdk` 或编造模块版本号。无钩子的位置：`EventFactory.createArrayBacked` + Mixin `EVENT.invoker()`（官方 develop/events「Custom Events」）。

## 本档版本特有事实（05-events.mdc 差异点）

- 物品使用 `UseItemCallback.EVENT` 本档返回 `TypedActionResult<ItemStack>`（不要返回 `ActionResult`）。
- 实体交互：`AttackEntityCallback.EVENT`；**`ServerLivingEntityEvents.ALLOW_DAMAGE / AFTER_DEATH / ALLOW_DEATH`**（1.19.4 起加入）；Fabric **不能**改伤害数值（没有 `EntityEvents.ENTITY_HURT` 那种返回 float 的回调）。
- 数据包重载：`ServerLifecycleEvents.START_DATA_PACK_RELOAD` / `END_DATA_PACK_RELOAD`。

## 常用事件速查（以本档 05 原文为准）

- 每 tick：客户端 `ClientTickEvents.END_CLIENT_TICK`；服务端 `ServerTickEvents.START_SERVER_TICK` / `END_SERVER_TICK`（每个玩家需自己遍历 `server.getPlayerManager().getPlayerList()`）；**没有** `PlayerTickEvents`。
- 方块破坏：`PlayerBlockBreakEvents.BEFORE`（返回 **boolean**，false 取消）/ `AFTER`；空手打方块 `AttackBlockCallback.EVENT`；右键方块 `UseBlockCallback.EVENT`（真正「已放置」后逻辑通常要 Mixin `Block.place`，没有 `BlockEvents.BLOCK_PLACE`）。
- 实体交互：`AttackEntityCallback.EVENT`；死亡/伤害按本档特有事实（见上），禁止编造其它 `EntityEvents.*` 门面。
- 生命周期：`ServerLifecycleEvents.SERVER_STARTED / SERVER_STOPPING / SERVER_STOPPED`，以及数据包重载 `START_DATA_PACK_RELOAD` / `END_DATA_PACK_RELOAD`。

## 常见错误

- 用 `@SubscribeEvent` / `@EventHandler`（Fabric 无此类注解，回调不会被注册）
- 在客户端 lambda 里改服务端世界数据（用 `world.isClient` 区分）
- 忘记处理返回值；把 `PlayerBlockBreakEvents.BEFORE` 当成 `ActionResult`（它是 boolean）
