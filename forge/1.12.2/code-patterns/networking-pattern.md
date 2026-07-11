# 网络通信模式

## 消息类

```java
public class MyMessage implements IMessage {

    private int data;

    public MyMessage() {}

    public MyMessage(int data) {
        this.data = data;
    }

    @Override
    public void fromBytes(PacketBuffer buf) {
        data = buf.readInt();
    }

    @Override
    public void toBytes(PacketBuffer buf) {
        buf.writeInt(data);
    }
}
```

## 消息处理器

```java
public class MyMessageHandler implements IMessageHandler<MyMessage, IMessage> {

    @Override
    public IMessage onMessage(MyMessage message, MessageContext ctx) {
        if (ctx.side == EnumFacing.Side.SERVER) {
            ctx.getServerHandler().player.getServerWorld().addScheduledTask(() -> {
                EntityPlayerMP player = ctx.getServerHandler().player;
                // 处理消息
                player.getHeldItemMainhand().getOrCreateTag().setInteger("data", message.data);
            });
        }
        return null;
    }
}
```

## 网络包注册

```java
public class NetworkHandler {

    public static SimpleNetworkWrapper INSTANCE;
    private static int packetId = 0;

    public static void init() {
        INSTANCE = NetworkRegistry.INSTANCE.newSimpleChannel(ExampleMod.MOD_ID);
        registerMessage(MyMessage.class, new MyMessageHandler());
    }

    private static <REQ, REPLY> void registerMessage(
            Class<REQ> messageType, IMessageHandler<REQ, REPLY> handler) {
        INSTANCE.registerMessage(
            packetId++,
            messageType,
            messageType,
            NetworkRegistry.instance().nextID(),
            handler
        );
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
// 发送消息
NetworkHandler.sendToServer(new MyMessage(42));

// 初始化（在主类的 init 或 preInit 中）
NetworkHandler.init();
```
