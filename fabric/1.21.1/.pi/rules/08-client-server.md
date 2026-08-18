---
description: 08 — 客户端 / 服务端分离
---

# 08 — 客户端 / 服务端分离

|> 适用版本：Fabric 1.21.1

---

## 约束

### 核心原则

- Fabric 使用 `EnvType`（`CLIENT` / `SERVER`）区分运行环境
- 客户端专用代码必须放在 `ClientModInitializer` 中
- 服务端代码在 `ModInitializer.onInitialize()` 中
- **禁止**在共享代码中直接引用客户端类
- 使用 `@Environment(EnvType.CLIENT)` 注解标记客户端方法

---

## Decision Flow

### Decision: 选择运行环境判断方式

```
IF 判断当前环境是否为客户端
  → FabricLoader.getInstance().getEnvironmentType() == EnvType.CLIENT
  → World.isClient（已在 World 实例上调用）

IF 需要在客户端执行初始化
  → 在 ClientModInitializer.onInitializeClient() 中执行

IF 需要在服务端执行初始化
  → 在 ModInitializer.onInitialize() 中执行（排除客户端）

IF 需要共享初始化的回调
  → 使用 mixin 或事件系统，在两端都执行
```

---

## 入口点分离

```java
// 服务端 + 共享逻辑
public class ExampleMod implements ModInitializer {
    @Override
    public void onInitialize() {
        // 服务端逻辑和共享逻辑
        Registry.register(Registries.ITEM, new Identifier(MOD_ID, "my_item"), myItem);
    }
}

// 客户端专用逻辑
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        // 仅客户端执行的代码
        EntityRendererRegistry.register(...);
        KeyBindingHelper.registerKeyBinding(...);
        ClientPlayNetworking.registerGlobalReceiver(PACKET_ID, (client, handler, buf, responseSender) -> {});
    }
}
```

```json
// fabric.mod.json
{
  "entrypoints": {
    "main": ["com.example.examplemod.ExampleMod"],
    "client": ["com.example.examplemod.ExampleModClient"]
  }
}
```

## EnvType 判断

```java
// 在共享代码中判断环境
if (FabricLoader.getInstance().getEnvironmentType() == EnvType.CLIENT) {
    // 客户端专用逻辑
}

// 在 World 实例上判断（更常用）
if (world.isClient) {
    // 客户端逻辑
} else {
    // 服务端逻辑
}
```

## @Environment 注解

```java
// 标记为仅客户端方法
@Environment(EnvType.CLIENT)
public void initClientOnly() {
    // 仅在客户端编译和执行
}

// 标记为仅服务端方法
@Environment(EnvType.SERVER)
public void initServerOnly() {
    // 仅在服务端编译和执行
}
```

## 常见环境相关错误

```java
// ❌ 错误：在共享代码中创建客户端渲染器
public class ExampleMod implements ModInitializer {
    public void onInitialize() {
        // 不要在这里调用 EntityRendererRegistry！
        // 这会在服务端启动时崩溃
    }
}

// ✅ 正确：客户端逻辑放在 ClientModInitializer
public class ExampleModClient implements ClientModInitializer {
    public void onInitializeClient() {
        EntityRendererRegistry.register(...);
    }
}
```

## Mixin 中的客户端/服务端分离

```json
// fabric.mixins.json
{
  "required": true,
  "package": "com.example.examplemod.mixin",
  "compatibilityLevel": "JAVA_17",
  "client": ["client.ClientMixinClass"],
  "server": [],
  "mixins": ["common.CommonMixin"]
}
```

```java
// 客户端 Mixin
@Mixin(WorldRenderer.class)
public class ClientWorldRendererMixin {
    // 仅在客户端注入
}

// 服务端 Mixin
@Mixin(ServerWorld.class)
public class ServerWorldMixin {
    // 仅在服务端注入
}
```

## 与 Forge @OnlyIn 的对比

| Forge | Fabric |
|-------|--------|
| `@OnlyIn(Dist.CLIENT)` 注解 | `EnvType.CLIENT` + `ClientModInitializer` |
| `@OnlyIn(Dist.DEDICATED_SERVER)` | `EnvType.SERVER` |
| 在任意位置标注 | 入口点分离 + Mixin 配置分离 |

## 常见错误

- ❌ 在 `onInitialize()` 中注册客户端专用组件 — 服务端启动崩溃
- ❌ 忘记 `@Environment(EnvType.CLIENT)` 注解 — 客户端代码打包到服务端
- ❌ 在 Mixin 中引用客户端类但未在 `fabric.mixins.json` 的 `client` 中声明 — 注入失败
- ❌ 在共享代码中使用 `MinecraftClient.getInstance()` — 服务端无 `MinecraftClient` 类

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-gui` | GUI 必须在客户端初始化 |
| `mc-networking` | 客户端网络在 ClientModInitializer 中注册 |
| `mc-mixin` | Mixin 可通过 fabric.mixins.json 分离客户端/服务端 |
| `mc-entity` | 实体渲染器在客户端注册 |
