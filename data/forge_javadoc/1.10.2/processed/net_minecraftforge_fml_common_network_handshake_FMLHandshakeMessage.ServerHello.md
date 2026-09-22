# FMLHandshakeMessage.ServerHello

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.network.handshake.FMLHandshakeMessage → net.minecraftforge.fml.common.network.handshake.FMLHandshakeMessage.ServerHello

## Class signature

```java
public static class FMLHandshakeMessage.ServerHello extends FMLHandshakeMessage
```

## Constructors

- `ServerHello()`
- `ServerHello(int overrideDim)`

## Methods

- `void fromBytes(io.netty.buffer.ByteBuf buffer)`
- `int overrideDim()`
- `byte protocolVersion()`
- `void toBytes(io.netty.buffer.ByteBuf buffer)`