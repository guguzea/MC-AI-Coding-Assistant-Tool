# Fabric 网络通信命令参考

本文件描述 Fabric 1.18.2 平台上进行网络通信（Networking）开发时所需掌握的核心 API 和常用命令。

## 核心原则

Fabric 的网络通信遵循客户端-服务端架构：客户端只能向服务端发送数据包（C2S），服务端可以向客户端发送数据包（S2C）。禁止在网络处理中执行高开销操作，所有网络回调都应快速返回。网络包必须是确定性的，不应包含随机数或依赖于非确定性状态。客户端网络代码必须在 `ClientModInitializer.onInitializeClient()` 中注册，服务端网络代码在 `FabricMod.onInitialize()` 中注册。

## 数据包注册命令

### Identifier 创建命令

每个网络包需要一个唯一的 `Identifier` 作为包 ID。基本命令：`new Identifier(MOD_ID, "packet_name")`。包 ID 的命名空间（mod ID）必须与发送方和接收方一致。服务端和客户端必须使用相同的包 ID，否则数据包无法被正确路由。建议使用描述性的名称，如 `"open_gui"`、`"sync_inventory"`、`"update_energy"`。

### ClientSidePacketRegistry C2S 注册命令

客户端向服务端发送数据包，使用 `ClientSidePacketRegistry` 注册接收器：

```java
public static void registerServerReceiver() {
    ClientSidePacketRegistry.INSTANCE.register(
        MY_PACKET_ID,
        (packetContext, attachedData) -> {
            // packetContext 包含发送数据包的客户端玩家
            // attachedData 是 PacketByteBuf，包含数据包内容
            int value = attachedData.readInt();
            String text = attachedData.readString();
            
            packetContext.queue(() -> {
                // 在服务端线程执行游戏逻辑
                PlayerEntity player = packetContext.getPlayer();
                // 处理数据...
            });
        }
    );
}
```

注册在 `FabricMod.onInitialize()` 中调用，因为服务端需要接收客户端数据包。

### ServerSidePacketRegistry S2C 注册命令

服务端向客户端发送数据包，使用 `ServerSidePacketRegistry` 注册接收器：

```java
public static void registerClientReceiver() {
    ServerSidePacketRegistry.INSTANCE.register(
        MY_PACKET_ID,
        (packetContext, attachedData) -> {
            boolean flag = attachedData.readBoolean();
            
            packetContext.queue(() -> {
                // 在客户端线程执行渲染逻辑
                MinecraftClient client = MinecraftClient.getInstance();
                // 处理数据...
            });
        }
    );
}
```

注册在 `ClientModInitializer.onInitializeClient()` 中调用，因为客户端需要接收服务端数据包。

### packetContext.queue() 命令

`packetContext.queue()` 是非常重要的命令，用于将游戏逻辑调度到正确线程执行。网络回调可能在网络线程调用，而 Minecraft 的游戏逻辑必须在游戏线程执行。使用 `queue()` 确保代码在正确的线程执行。队列中的代码会在下一个游戏 tick 开始时执行。

## 数据读写命令

### PacketByteBuf 创建命令

创建数据包缓冲区：`PacketByteBuf.createUnpooled()` 创建新的缓冲区，`PacketByteBuf.wrap(byte[])` 从现有字节数组创建。使用完成后缓冲区会被自动释放，不需要手动关闭。

### 写入命令

数据包中写入数据使用一系列 `write` 方法：

```java
PacketByteBuf buf = PacketByteBuf.createUnpooled();
buf.writeInt(42);                    // 写入整数
buf.writeFloat(3.14f);              // 写入浮点数
buf.writeString("text");             // 写入字符串（带长度前缀）
buf.writeBoolean(true);              // 写入布尔值
buf.writeEnumConstant(MyEnum.VALUE); // 写入枚举值
buf.writeItemStack(itemStack);       // 写入物品栈（包含 NBT）
buf.writeBlockPos(pos);              // 写入方块坐标
buf.writeIdentifier(identifier);     // 写入 Identifier
buf.writeUuid(uuid);                 // 写入 UUID
```

### 读取命令

从数据包中读取数据使用对应的 `read` 方法，顺序必须与写入顺序完全一致：

```java
int value = buf.readInt();           // 读取整数
float f = buf.readFloat();           // 读取浮点数
String text = buf.readString();      // 读取字符串
boolean flag = buf.readBoolean();    // 读取布尔值
MyEnum enumValue = buf.readEnumConstant(MyEnum.class);
ItemStack itemStack = buf.readItemStack();
BlockPos pos = buf.readBlockPos();
Identifier id = buf.readIdentifier();
UUID uuid = buf.readUuid();
```

## 数据包发送命令

### ClientPlayNetworking.send() C2S 发送命令

客户端向服务端发送数据包：

```java
public void sendToServer(int value) {
    ClientPlayNetworking.send(
        MY_PACKET_ID,
        PacketByteBuf.createUnpooled().writeInt(value)
    );
}
```

通常在玩家执行操作（如点击按钮、使用物品）时调用此方法。发送是异步的，不会阻塞游戏主线程。

### ServerPlayNetworking.send() S2C 发送命令

服务端向特定客户端发送数据包：

```java
public void sendToClient(PlayerEntity player, int value) {
    ServerPlayNetworking.send(
        player,
        MY_PACKET_ID,
        PacketByteBuf.createUnpooled().writeInt(value)
    );
}
```

可以向世界中的所有玩家广播，遍历 `server.getPlayerManager().getPlayerList()` 并分别发送。

### GlobalPacketRegistry 全局数据包命令

`GlobalPacketRegistry` 用于注册所有客户端/服务端都会接收的数据包，使用时需要同时在两端注册相同的 ID：`GlobalPacketRegistry.registerS2CPacket(id, handler)` 和 `GlobalPacketRegistry.registerC2SPacket(id, handler)`。

## 快捷键绑定命令

### KeyBinding 创建命令

快捷键是触发网络包的常用方式。在 `ClientModInitializer.onInitializeClient()` 中注册：

```java
KeyBinding keyBinding = KeyBindingHelper.registerKeyBinding(new KeyBinding(
    "key.examplemod.my_key",          // 翻译键
    InputUtil.Type.KEYSYM,             // 键类型（KEYSYM 或 SCANCODE）
    InputUtil.fromCode(80),           // 默认按键（P 键）
    "category.examplemod"             // 分类（用于设置菜单分组）
));
```

### 快捷键回调命令

监听快捷键触发需要注册 tick 事件：

```java
ClientTickEvents.END_CLIENT_TICK.register(client -> {
    while (keyBinding.wasPressed()) {
        // 快捷键被按下
        sendToServer(someData);  // 发送网络包
    }
});
```

使用 `wasPressed()` 而不是 `isPressed()`，因为前者会在消费后重置状态，避免重复触发。

## 状态同步命令

### ScreenHandler 同步命令

`ScreenHandler` 提供自动状态同步，是容器类 GUI 的推荐方式。服务端创建 `ScreenHandler` 时会自动将数据同步到打开对应 GUI 的客户端。对于更复杂的同步需求，可以在 `ScreenHandler` 中重写 `sendContentUpdates()` 自定义同步逻辑，或使用 `setStackInSlot()` 直接修改客户端物品栏。

### 自定义同步命令

需要同步自定义数据时，使用数据包：

```java
// 服务端：发送同步包
public void syncData(PlayerEntity player, MyData data) {
    ServerPlayNetworking.send(player, SYNC_PACKET_ID,
        PacketByteBuf.createUnpooled()
            .writeVarInt(data.getValue1())
            .writeString(data.getValue2()));
}

// 客户端：接收同步包
ServerSidePacketRegistry.INSTANCE.register(SYNC_PACKET_ID, (context, buf) -> {
    int value1 = buf.readVarInt();
    String value2 = buf.readString();
    context.queue(() -> {
        // 更新客户端数据
        myData.setValues(value1, value2);
    });
});
```

## 错误处理命令

### 数据验证命令

接收到数据包后应立即验证数据：

```java
ClientSidePacketRegistry.INSTANCE.register(PACKET_ID, (context, buf) -> {
    if (buf.readableBytes() < 4) {
        // 数据包太短，可能是恶意或损坏
        return;
    }
    int value = buf.readInt();
    if (value < 0 || value > 1000) {
        // 数值超出合理范围
        return;
    }
    // 处理有效数据...
});
```

### 线程安全命令

所有游戏状态修改必须在游戏主线程执行。使用 `packetContext.queue()` 包装所有状态修改代码。禁止在网络回调中直接创建新的 Minecraft 对象（如 `MinecraftClient.getInstance()` 在服务端不存在）。
