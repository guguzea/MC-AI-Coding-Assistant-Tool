# FMLHandshakeMessage

**Inheritance:** java.lang.Object → cpw.mods.fml.common.network.handshake.FMLHandshakeMessage

## Class signature

```java
public abstract class FMLHandshakeMessage extends java.lang.Object
```

## Constructors

- `FMLHandshakeMessage()`

## Methods

- `void fromBytes(ByteBuf buffer)`
- `static FMLProxyPacket makeCustomChannelRegistration(java.util.Set<java.lang.String> channels)`
- `void toBytes(ByteBuf buffer)`
- `java.lang.String toString(java.lang.Class<? extends java.lang.Enum<?>> side)`