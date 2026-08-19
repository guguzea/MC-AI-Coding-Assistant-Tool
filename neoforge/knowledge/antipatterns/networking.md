# 网络通信反模式

**本文件不是 SimpleChannel 教程。** NeoForge 按精确版本读 `neoforge/<ver>/.cursor/rules/06-networking.mdc`：

- 1.20.4：`RegisterPayloadHandlerEvent`（单数）+ `IPayloadRegistrar` + `CustomPacketPayload#write` / `id()`
- 1.21.1+：`RegisterPayloadHandlersEvent`（复数）+ `PayloadRegistrar` + `CustomPacketPayload.Type` + `StreamCodec`
- **禁止**把 Forge `SimpleChannel` / `IMessage` / `NetworkRegistry.newSimpleChannel` 改包名当 NeoForge

官方 1.21.1 payload：https://docs.neoforged.net/docs/1.21.1/networking/payload/

## 消息处理相关

### ❌ 在网络线程直接修改世界

**症状**：异步修改世界导致数据损坏或崩溃。

**正确方案**：在该版 payload handler 里回到主线程再改世界。

- 1.20.4 骨架用 `PlayPayloadContext#workHandler().submitAsync(...)`（见该档 06）
- 1.21.1+ 默认主线程；若 `registrar.executesOn(HandlerThread.NETWORK)` 再用 `IPayloadContext#enqueueWork`

不要再写 `NetworkEvent.Context` / `setPacketHandled` 当 NeoForge 正文。

---

### ❌ 逐字段发送大量网络数据

```java
// 错误：拆成多个 payload 狂发
PacketDistributor.sendToServer(new SyncFieldPayload("field1", value1));
PacketDistributor.sendToServer(new SyncFieldPayload("field2", value2));
```

**症状**：网络阻塞，服务器卡顿。

**正确方案**：一个 payload 里用 `CompoundTag` 或 `StreamCodec` 批量编码。序列化 API 以该版 06 为准（1.20.4 是 `FriendlyByteBuf#write`；1.21.1+ 是 `StreamCodec`）。

---

## 消息方向相关

### ❌ 在客户端 handler 里碰服务端独有类

**症状**：运行时崩溃（缺类 / `ClassCastException`）。

**正确方案**：按 `IPayloadContext` / `PlayPayloadContext` 的逻辑端分流；客户端不要引用 `ServerPlayer` 独有世界 API。具体类名见该档 06。

---

## 包名与注册

### ❌ 改包名继续 SimpleChannel

```java
// ❌ 错误：Forge 包名
import net.minecraftforge.network.NetworkRegistry;

// ❌ 同样错误：NeoForge 上继续 NetworkRegistry.newSimpleChannel
import net.neoforged.neoforge.network.NetworkRegistry;
```

1.20.4 档 06：**不要**顶层 `NetworkRegistry`。发信用该版 `PacketDistributor`（方法名以该档为准）。

### ❌ 事件名单复数抄错档

- 把 1.21 的 `RegisterPayloadHandlersEvent` 抄进 1.20.4
- 把 1.20.4 的 `RegisterPayloadHandlerEvent` 抄进 1.21.1+

### ❌ 协议版本

NeoForge 用 `event.registrar("1")`（或 1.20.4 的 `event.registrar("mymod")`）当协议/通道版本，**不要**自建 `SimpleChannel` + `PROTOCOL_VERSION` 字符串当正文。

### ❌ 自增 int 包 ID

`INSTANCE.registerMessage(0, ...)` 是 Forge `SimpleChannel` 写法，不是 NeoForge payload。payload 用 `ResourceLocation` / `Identifier` / `CustomPacketPayload.Type`（以该档为准），不要自己 `nextId++`。
