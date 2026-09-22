# FMLHandshakeMessage.ServerHello

**Inheritance:** java.lang.Object → cpw.mods.fml.common.network.handshake.FMLHandshakeMessage → cpw.mods.fml.common.network.handshake.FMLHandshakeMessage.ServerHello

## Class signature

```java
public static class FMLHandshakeMessage.ServerHello extends FMLHandshakeMessage
```

## Constructors

- `ServerHello()`
- `ServerHello(int overrideDim)`

## Methods

- `void fromBytes(ByteBuf buffer)`
- `int overrideDim()`
- `byte protocolVersion()`
- `void toBytes(ByteBuf buffer)`