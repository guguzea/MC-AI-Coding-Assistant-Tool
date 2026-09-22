# FMLHandshakeMessage.RegistryData

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.network.handshake.FMLHandshakeMessage → net.minecraftforge.fml.common.network.handshake.FMLHandshakeMessage.RegistryData

## Class signature

```java
public static class FMLHandshakeMessage.RegistryData extends FMLHandshakeMessage
```

## Constructors

- `RegistryData()`
- `RegistryData(boolean hasMore, ResourceLocation name, PersistentRegistryManager.GameDataSnapshot.Entry entry)`

## Methods

- `void fromBytes(io.netty.buffer.ByteBuf buffer)`
- `java.util.Set<ResourceLocation> getDummied()`
- `java.util.Map<ResourceLocation, java.lang.Integer> getIdMap()`
- `ResourceLocation getName()`
- `java.util.Set<ResourceLocation> getSubstitutions()`
- `boolean hasMore()`
- `void toBytes(io.netty.buffer.ByteBuf buffer)`
- `java.lang.String toString(java.lang.Class<? extends java.lang.Enum<?>> side)`