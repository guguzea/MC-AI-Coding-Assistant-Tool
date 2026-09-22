# SimpleNetworkWrapper

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.network.simpleimpl.SimpleNetworkWrapper

## Class signature

```java
public class SimpleNetworkWrapper extends java.lang.Object
```

## Constructors

- `SimpleNetworkWrapper(java.lang.String channelName)`

## Methods

- `Packet<?> getPacketFrom(IMessage message)` — Construct a minecraft packet from the supplied message.
- `<REQ extends IMessage, REPLY extends IMessage> void registerMessage(java.lang.Class<? extends IMessageHandler<REQ, REPLY>> messageHandler, java.lang.Class<REQ> requestMessageType, int discriminator, Side side)` — Register a message and it's associated handler.
- `<REQ extends IMessage, REPLY extends IMessage> void registerMessage(IMessageHandler<? super REQ, ? extends REPLY> messageHandler, java.lang.Class<REQ> requestMessageType, int discriminator, Side side)` — Register a message and it's associated handler.
- `void sendTo(IMessage message, EntityPlayerMP player)` — Send this message to the specified player.
- `void sendToAll(IMessage message)` — Send this message to everyone.
- `void sendToAllAround(IMessage message, NetworkRegistry.TargetPoint point)` — Send this message to everyone within a certain range of a point.
- `void sendToDimension(IMessage message, int dimensionId)` — Send this message to everyone within the supplied dimension.
- `void sendToServer(IMessage message)` — Send this message to the server.