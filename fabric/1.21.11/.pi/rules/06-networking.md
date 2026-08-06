---
description: 06 — 网络通信
---

# 06 — 网络通信

> 适用版本：Fabric 1.21.11

---

## 约束

### 核心原则

- Fabric 1.21.x 使用 `CustomPayload` + `PayloadTypeRegistry` + `ServerPlayNetworking` / `ClientPlayNetworking`
- ❌ 禁止使用 `ClientSidePacketRegistry` / `ServerSidePacketRegistry`（已在 1.21 移除）
- ❌ 禁止使用 `FabricPacket` 接口（已在 1.21 移除）
- 网络包必须是确定性的（不含随机或非确定性状态）
- 使用 `Identifier` 作为包 ID 命名空间

---

## Decision Flow

### Decision: 选择网络通信方式

```
IF 服务端向客户端单向推送数据（S2C）
  → 在客户端注册接收器：ClientPlayNetworking.registerGlobalReceiver()
  → 服务端发送：ServerPlayNetworking.send()

IF 客户端向服务端单向请求（C2S）
  → 在服务端注册接收器：ServerPlayNetworking.registerGlobalReceiver()
  → 客户端发送：ClientPlayNetworking.send()

IF 需要双向通信
  → 两端分别注册接收器
  → 两端都要注册 PayloadType
```

---

## 基础网络注册

### 步骤 1：定义 Payload

```java
public record MyPayload(int data) implements CustomPayload {
    public static final CustomPayload.Id<MyPayload> ID =
        new CustomPayload.Id<>(new Identifier(MOD_ID, "my_packet"));

    // 解码
    public static MyPayload read(FriendlyByteBuf buf) {
        return new MyPayload(buf.readInt());
    }

    // 编码
    @Override
    public void write(FriendlyByteBuf buf) {
        buf.writeInt(this.data);
    }
}
```

### 步骤 2：注册类型（在 onInitialize 中）

```java
@Override
public void onInitialize() {
    // 注册 S2C 类型
    PayloadTypeRegistry.s2c().register(MyPayload.ID, MyPayload::read);
    // 注册 C2S 类型
    PayloadTypeRegistry.c2s().register(MyPayload.ID, MyPayload::read);
}
```

### 步骤 3：注册接收器

```java
// 服务端接收 C2S
ServerPlayNetworking.registerGlobalReceiver(MyPayload.ID, (payload, context) -> {
    int value = payload.data();
    ServerPlayerEntity player = context.getPlayer();
    // 直接处理，无需 queue
});

// 客户端接收 S2C（在 ClientModInitializer）
ClientPlayNetworking.registerGlobalReceiver(MyPayload.ID, (payload, context) -> {
    int value = payload.data();
    // 处理
});
```

### 步骤 4：发送数据包

```java
// 服务端向客户端发送
ServerPlayNetworking.send(player, MyPayload.ID, new MyPayload(value));

// 客户端向服务端发送
ClientPlayNetworking.send(MyPayload.ID, new MyPayload(value));
```

## fabric.mod.json 配置

```json
{
  "entrypoints": {
    "main": ["com.example.examplemod.ExampleMod"],
    "client": ["com.example.examplemod.ExampleModClient"]
  },
  "mixins": ["examplemod.mixins.json"]
}
```

## 客户端入口点（网络初始化）

```java
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        // 注册 S2C 接收器
        ClientPlayNetworking.registerGlobalReceiver(MyPayload.ID, (payload, context) -> {
            int value = payload.data();
            // 处理来自服务端的数据
        });

        // 注册快捷键
        KeyBindingHelper.registerKeyBinding(new KeyBinding(
            "key.examplemod.open_gui",
            InputUtil.Type.KEYSYM,
            InputUtil.fromCode(80),  // P 键
            "category.examplemod"
        ));

        // 快捷键回调
        ClientTickEvents.END_CLIENT_TICK.register(client -> {
            while (KeyBindings.OPEN_GUI.wasPressed()) {
                // 打开 GUI 并发送网络包
                ClientPlayNetworking.send(MyPayload.ID, new MyPayload(42));
            }
        });
    }
}
```

## 常见错误

- ❌ 使用旧的 `ClientSidePacketRegistry` / `ServerSidePacketRegistry` — 1.21.x 已移除
- ❌ 使用旧的 `FabricPacket` 接口 — 改用 `CustomPayload` record
- ❌ 在非主线程处理数据 — 新 API 回调已在正确线程执行，无需 queue
- ❌ 忘记在 `fabric.mod.json` 中注册 entrypoint — 网络回调不生效
- ❌ 在服务端处理客户端数据时修改世界状态 — 确认线程安全
- ❌ 包 ID 命名空间不一致 — 服务端和客户端 ID 必须完全相同
- ❌ 在 `onInitialize()` 中注册客户端网络 — 应在 `ClientModInitializer.onInitializeClient()` 中

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-gui` | 网络用于 GUI 数据同步 |
| `mc-item` | 物品使用触发网络包 |
| `mc-entity` | 实体状态通过网络同步 |
