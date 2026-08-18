# 网络通信模式（Forge 1.12.2）

## 消息类

```java
public class MyMessage implements IMessage {
    private int data;

    public MyMessage() {}

    public MyMessage(int data) {
        this.data = data;
    }

    @Override
    public void fromBytes(ByteBuf buf) {
        data = buf.readInt();
    }

    @Override
    public void toBytes(ByteBuf buf) {
        buf.writeInt(data);
    }
}
```

## 消息处理器

```java
public class MyMessageHandler implements IMessageHandler<MyMessage, IMessage> {
    @Override
    public IMessage onMessage(MyMessage message, MessageContext ctx) {
        if (ctx.side == Side.SERVER) {
            EntityPlayerMP player = ctx.getServerHandler().playerEntity;
            player.getServerWorld().addScheduledTask(() -> {
                // 处理消息
            });
        }
        return null;
    }
}
```

## 网络包注册

```java
public class NetworkHandler {
    public static final SimpleNetworkWrapper INSTANCE =
            NetworkRegistry.INSTANCE.newSimpleChannel(ExampleMod.MOD_ID);
    private static int packetId = 0;

    public static void init() {
        INSTANCE.registerMessage(MyMessageHandler.class, MyMessage.class, packetId++, Side.SERVER);
    }

    public static void sendToServer(MyMessage message) {
        INSTANCE.sendToServer(message);
    }

    public static void sendTo(MyMessage message, EntityPlayerMP player) {
        INSTANCE.sendTo(message, player);
    }
}
```

## 使用

```java
NetworkHandler.sendToServer(new MyMessage(42));

// 在主类 init 中
NetworkHandler.init();
```
