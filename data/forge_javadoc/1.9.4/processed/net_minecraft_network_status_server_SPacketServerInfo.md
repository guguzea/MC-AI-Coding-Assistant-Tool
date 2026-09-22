# SPacketServerInfo

**Inheritance:** java.lang.Object → net.minecraft.network.status.server.SPacketServerInfo

## Class signature

```java
public class SPacketServerInfo extends java.lang.Object implements Packet<INetHandlerStatusClient>
```

## Constructors

- `SPacketServerInfo()`
- `SPacketServerInfo(ServerStatusResponse responseIn)`

## Methods

- `ServerStatusResponse getResponse()`
- `void processPacket(INetHandlerStatusClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`

## Fields

- `static com.google.gson.Gson GSON`