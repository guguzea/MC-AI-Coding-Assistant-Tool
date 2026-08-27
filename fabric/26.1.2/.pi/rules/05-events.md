---
description: 05 — 事件系统
---

# 05 — 事件系统

> 适用版本：Fabric 26.1.2（**Mojmap**，不要抄 Yarn `PlayerEntity` / `ActionResult`）

入库页 `26.1.2/develop_events`：`net.fabricmc.fabric.api.event.Event`，回调 `.register()`。
示例页用 `AttackBlockCallback`、`LootTableEvents.MODIFY`。不要用 Forge `@SubscribeEvent`。
不要编造 `ItemEvents` / `BlockEvents` / `PlayerTickEvents` / `@EventHandler`。

---

## 约束

### 核心原则

- 回调是传给事件的代码；游戏触发时执行（官方 events 页）
- 在初始化里 `SomeCallback.EVENT.register(...)`（或 `PlayerBlockBreakEvents.BEFORE.register`）
- 静态 `Event` 字段，不是注解总线
- 方法名与类型用 **Mojmap**：`Player`、`Level`、`InteractionResult`、`InteractionHand`

### 与 Forge 的区别

| Forge | Fabric 26.1.2 |
|-------|--------|
| `@SubscribeEvent` | `EVENT.register(lambda)` |
| `IEventBus` | 各 API 类上的静态 `Event` |
| `EventPriority` | Fabric Phase，不是 Forge 优先级 |
| `setCanceled` | 返回 `InteractionResult` / `boolean` |

---

## Decision Flow

```
→ Fabric 事件 → Event.register
→ 玩家 tick → ClientTickEvents / ServerTickEvents（不要 PlayerTickEvents）
→ 破坏方块 → PlayerBlockBreakEvents.BEFORE（boolean）
→ 左键方块 → AttackBlockCallback.EVENT
→ 右键方块 → UseBlockCallback.EVENT
→ 使用物品 → UseItemCallback.EVENT（本档返回 InteractionResult）
→ 实体死亡 → ServerLivingEntityEvents.AFTER_DEATH
→ 生命周期 → ServerLifecycleEvents.SERVER_STARTED / SERVER_STOPPING
→ 数据包重载 → ServerLifecycleEvents.END_DATA_PACK_RELOAD
→ 自定义按键 → 仅客户端：KeyMappingHelper.registerKeyMapping + ClientTickEvents（文档 develop_key-mappings）
→ 不要 @SubscribeEvent / IEventBus
→ 核不到 → search_fabric_docs version=26.1.2
```

---

## 常用事件

### Tick

```java
ClientTickEvents.END_CLIENT_TICK.register(client -> {
    if (client.player == null) return;
});

ServerTickEvents.END_SERVER_TICK.register(server -> {
    for (var player : server.getPlayerList().getPlayers()) {
        // 每 tick 每个玩家
    }
});
```

### 方块 / 物品

```java
AttackBlockCallback.EVENT.register((player, level, hand, pos, direction) -> {
    return InteractionResult.PASS;
});

UseBlockCallback.EVENT.register((player, level, hand, hitResult) -> {
    return InteractionResult.PASS;
});

UseItemCallback.EVENT.register((player, level, hand) -> {
    return InteractionResult.PASS;
});

PlayerBlockBreakEvents.BEFORE.register((level, player, pos, state, blockEntity) -> {
    return true; // false 取消破坏
});
```

### 实体与生命周期

```java
ServerLivingEntityEvents.AFTER_DEATH.register((entity, source) -> {
});

ServerLivingEntityEvents.ALLOW_DAMAGE.register((entity, source, amount) -> true);

ServerLifecycleEvents.SERVER_STARTED.register(server -> {
});

ServerLifecycleEvents.SERVER_STOPPING.register(server -> {
});
```

### 按键（仅客户端）

文档 `26.1.2/develop_key-mappings`。loader-api：`net.fabricmc.fabric.api.client.keymapping.v1.KeyMappingHelper.registerKeyMapping(KeyMapping)`。分类翻译键 `key.category.<namespace>.<path>`。响应用 `ClientTickEvents`，不要在服务端入口注册。

## 常见错误

- ❌ 把 Yarn 的 `ActionResult` / `PlayerEntity` / `world.isClient` 抄进 26.1.2
- ❌ `PayloadTypeRegistry.playS2C()`（那是 Yarn 1.21；本档网络见 `06-networking.mdc`）
- ❌ `gui.setScreen`（26.2 旁路，不是本档）
- ❌ 在服务端入口调用 KeyMappingHelper / 注册 KeyMapping

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-item` | UseItemCallback / UseBlockCallback |
| `mc-entity` | ServerLivingEntityEvents |
| `mc-networking` | 事件里发 CustomPacketPayload |
| `mc-gui` | 客户端 tick 打开 Screen |
| `mc-fabric-api` | KeyMappingHelper |
