# Fabric 网络通信命令参考

> 本文件描述 Fabric 1.21.11 平台上进行网络通信（Networking）开发时所需掌握的核心 API 和常用命令。

## ⚠️ 重要：1.21.x 网络 API 重大变化

**从 1.21 开始，Fabric 网络系统完全重构：**
- ❌ `ClientSidePacketRegistry` / `ServerSidePacketRegistry` 已被**移除**
- ❌ `FabricPacket` 接口已被**移除**
- ❌ `GlobalPacketRegistry` 已被**移除**
- ✅ 使用 `CustomPayload` 接口 + `PayloadTypeRegistry`
- ✅ 使用 `ServerPlayNetworking` / `ClientPlayNetworking` 注册接收器

---

## 步骤 1：定义 CustomPayload

```java
public record MyPayload(int value, String text) implements CustomPayload {
    public static final CustomPayload.Id<MyPayload> ID =
        new CustomPayload.Id<>(new Identifier(MOD_ID, "my_packet"));

    // 解码（从 FriendlyByteBuf 构造）
    public static MyPayload read(FriendlyByteBuf buf) {
        return new MyPayload(buf.readInt(), buf.readString());
    }

    // 编码
    @Override
    public void write(FriendlyByteBuf buf) {
        buf.writeInt(this.value);
        buf.writeString(this.text);
    }
}
```

---

## 步骤 2：注册 Payload 类型

在 `onInitialize()` 中注册：

```java
// 服务端 → 客户端（S2C）
PayloadTypeRegistry.s2c().register(MyPayload.ID, MyPayload::read);

// 客户端 → 服务端（C2S）
PayloadTypeRegistry.c2s().register(MyPayload.ID, MyPayload::read);
```

---

## 步骤 3：注册接收器

**服务端接收 C2S（在 onInitialize 中）：**

```java
ServerPlayNetworking.registerGlobalReceiver(MyPayload.ID, (payload, context) -> {
    int value = payload.value();
    String text = payload.text();
    ServerPlayerEntity player = context.getPlayer();
    // 直接处理，无需 queue（已在正确线程）
});
```

**客户端接收 S2C（在 ClientModInitializer.onInitializeClient 中）：**

```java
ClientPlayNetworking.registerGlobalReceiver(MyPayload.ID, (payload, context) -> {
    int value = payload.value();
    String text = payload.text();
    // 处理来自服务端的数据
});
```

---

## 步骤 4：发送数据包

**服务端向客户端发送：**

```java
ServerPlayNetworking.send(player, MyPayload.ID, new MyPayload(42, "hello"));
```

**客户端向服务端发送：**

```java
ClientPlayNetworking.send(MyPayload.ID, new MyPayload(42, "hello"));
```

---

## 数据读写命令

FriendlyByteBuf 的读写方法与旧的 PacketByteBuf 兼容：

```java
buf.writeInt(42);                    // 写入整数
buf.writeFloat(3.14f);              // 写入浮点数
buf.writeString("text");             // 写入字符串
buf.writeBoolean(true);              // 写入布尔值
buf.writeEnumConstant(MyEnum.VALUE); // 写入枚举值
buf.writeItemStack(itemStack);       // 写入物品栈
buf.writeBlockPos(pos);              // 写入方块坐标
buf.writeIdentifier(identifier);     // 写入 Identifier
buf.writeUuid(uuid);                 // 写入 UUID

// 对应读取
int v = buf.readInt();
float f = buf.readFloat();
String s = buf.readString();
```

---

## 快捷键绑定

```java
// 在 ClientModInitializer 中
KeyBinding keyBinding = KeyBindingHelper.registerKeyBinding(new KeyBinding(
    "key.examplemod.my_key",
    InputUtil.Type.KEYSYM,
    InputUtil.fromCode(80),  // P 键
    "category.examplemod"
));

ClientTickEvents.END_CLIENT_TICK.register(client -> {
    while (keyBinding.wasPressed()) {
        ClientPlayNetworking.send(MyPayload.ID, new MyPayload(42, "pressed"));
    }
});
```

---

## 常见错误

- ❌ 使用旧的 `ClientSidePacketRegistry` / `ServerSidePacketRegistry` — 1.21.x 已移除
- ❌ 使用旧的 `FabricPacket` 接口 — 改用 `CustomPayload` record
- ❌ 序列化顺序不匹配 — 读写顺序必须完全一致
- ❌ 在非主线程处理数据 — 新 API 回调已在正确线程执行
- ❌ C2S 接收器在客户端注册 — C2S 接收器在服务端注册
