# FMLHandshakeMessage.ModIdData

**Inheritance:** java.lang.Object → cpw.mods.fml.common.network.handshake.FMLHandshakeMessage → cpw.mods.fml.common.network.handshake.FMLHandshakeMessage.ModIdData

## Class signature

```java
public static class FMLHandshakeMessage.ModIdData extends FMLHandshakeMessage
```

## Constructors

- `ModIdData()`
- `ModIdData(GameData.GameDataSnapshot snapshot)`

## Methods

- `java.util.Set<java.lang.String> blockSubstitutions()`
- `java.util.Map<java.lang.String, java.lang.Integer> dataList()`
- `void fromBytes(ByteBuf buffer)`
- `java.util.Set<java.lang.String> itemSubstitutions()`
- `void toBytes(ByteBuf buffer)`
- `java.lang.String toString(java.lang.Class<? extends java.lang.Enum<?>> side)`