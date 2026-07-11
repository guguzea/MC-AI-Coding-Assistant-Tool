# 网络通信反模式（Fabric 1.21.11）

## 症状

- 网络包不发送
- 客户端/服务端通信失败
- 数据包内容不一致
- 游戏崩溃（非法数据包）
- 仍在使用旧的 `ClientSidePacketRegistry` / `ServerSidePacketRegistry`

## 根因分析

### 1. 使用了 1.20.x 的旧网络 API（最常见错误）

**错误代码（1.20.x 方式）：**
```java
// ❌ 1.21.x 已移除这些 API
ClientSidePacketRegistry.INSTANCE.register(MY_PACKET_ID, (packetContext, buf) -> {
    packetContext.queue(() -> {
        int value = buf.readInt();
    });
});
```

**正确方案（1.21.x）：**
```java
// ✅ 使用 PayloadTypeRegistry + CustomPayload
public record MyPayload(int data) implements CustomPayload {
    public static final CustomPayload.Id<MyPayload> ID =
        new CustomPayload.Id<>(new Identifier(MOD_ID, "my_packet"));

    public static MyPayload read(FriendlyByteBuf buf) {
        return new MyPayload(buf.readInt());
    }

    @Override
    public void write(FriendlyByteBuf buf) {
        buf.writeInt(this.data);
    }
}

// 在 onInitialize() 中注册
PayloadTypeRegistry.s2c().register(ID, MyPayload::read);
PayloadTypeRegistry.c2s().register(ID, MyPayload::read);
```

### 2. 忘记在客户端 entrypoint 注册

**错误代码：**
```java
// ❌ 在 FabricMod.onInitialize() 中注册网络接收器
public class ExampleMod implements FabricMod {
    @Override
    public void onInitialize() {
        // ❌ 服务端会崩溃，客户端 API 不能在服务端注册
        PayloadTypeRegistry.s2c().register(...);  // 服务端注册 S2C ✓
        // 但 C2S 处理器在服务端注册是错误的
    }
}
```

**正确方案：**
```java
// ✅ 通用注册在 onInitialize()
public class ExampleMod implements FabricMod {
    @Override
    public void onInitialize() {
        // S2C 和 C2S 注册都在这里
        PayloadTypeRegistry.s2c().register(MyPayload.ID, MyPayload::read);
        PayloadTypeRegistry.c2s().register(MyPayload.ID, MyPayload::read);
    }
}

// ✅ C2S 处理器在服务端（ClientPlayNetworking 发送时）
ServerPlayNetworking.registerGlobalReceiver(MyPayload.ID, (payload, context) -> {
    // 在服务端线程执行，无需 queue
    int value = payload.data();
    // 处理
});

// ✅ S2C 处理器在客户端
ClientPlayNetworking.registerGlobalReceiver(MyPayload.ID, (payload, context) -> {
    // 在客户端线程执行
});
```

### 3. 在非主线程处理数据（旧 API 遗留问题）

**错误代码：**
```java
// ❌ 使用旧的 queue() 方式
ClientSidePacketRegistry.INSTANCE.register(MY_PACKET_ID, (packetContext, buf) -> {
    packetContext.queue(() -> {
        world.setBlockState(pos, Blocks.DIAMOND.getDefaultState());
    });
});
```

**正确方案（1.21.x）：**
```java
// ✅ 新 API 回调已在正确线程执行，无需 queue
ServerPlayNetworking.registerGlobalReceiver(MyPayload.ID, (payload, context) -> {
    // 直接处理，服务端线程
    int value = payload.data();
});
```

### 4. 包 ID 命名空间不一致

**错误代码：**
```java
// 客户端
Identifier MY_PACKET = new Identifier(MOD_ID, "my_packet");

// 服务端
Identifier MY_PACKET = new Identifier("other_mod", "my_packet");  // ❌ 命名空间不同！
```

### 5. PayloadTypeRegistry 方向错误

| 注册方向 | 含义 | 使用场景 |
|---------|------|---------|
| `PayloadTypeRegistry.s2c()` | 服务端 → 客户端 | 服务端发送，客户端接收 |
| `PayloadTypeRegistry.c2s()` | 客户端 → 服务端 | 客户端发送，服务端接收 |

**错误：**
```java
// ❌ S2C 数据包在服务端注册接收器
PayloadTypeRegistry.s2c().register(ID, ...);  // 正确注册类型
ServerPlayNetworking.registerGlobalReceiver(ID, ...);  // ❌ 客户端才需要接收 S2C
```

**正确：**
```java
// 服务端：注册 S2C 类型 + 发送 S2C 数据包
PayloadTypeRegistry.s2c().register(MyPayload.ID, MyPayload::read);
// 发送：
ServerPlayNetworking.send(player, MyPayload.ID, new MyPayload(value));

// 客户端：接收 S2C 数据包
ClientPlayNetworking.registerGlobalReceiver(MyPayload.ID, (payload, context) -> {
    // 处理来自服务端的数据
});
```

### 6. 仍在使用 `fabric-networking-api-v1`

**错误代码：**
```groovy
// ❌ v1 模块在 1.21.x 已被重构
modImplementation "net.fabricmc.fabric-api:fabric-networking-api-v1:1.3.8+1.20.1"
```

**正确方案：**
```groovy
// ✅ 1.21.x 使用内置的 PayloadTypeRegistry + CustomPayload
// 不需要额外依赖网络模块
```

## 诊断清单

| 检查项 | 方法 |
|--------|------|
| 是否使用 1.21.x API | 确认使用 `CustomPayload` + `PayloadTypeRegistry` |
| 客户端/服务端分离 | 发送端在需要端注册，接收端在接收端注册 |
| 包 ID 一致性 | 对比客户端和服务端 Identifier |
| 序列化顺序 | 对比读写顺序 |
| Payload 方向 | 确认 `s2c` vs `c2s` 对应正确方向 |
