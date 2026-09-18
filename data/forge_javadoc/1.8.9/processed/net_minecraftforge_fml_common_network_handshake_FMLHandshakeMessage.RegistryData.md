# FMLHandshakeMessage.RegistryData

## Constructors

- `public RegistryData()`
- `public RegistryData(boolean hasMore, ResourceLocation name, PersistentRegistryManager.GameDataSnapshot.Entry entry)`

## Methods

- `public void fromBytes(ByteBuf buffer)`
- `public void toBytes(ByteBuf buffer)`
- `public java.util.Map< ResourceLocation ,java.lang.Integer> getIdMap()`
- `public java.util.Set< ResourceLocation > getSubstitutions()`
- `public java.util.Set< ResourceLocation > getDummied()`
- `public ResourceLocation getName()`
- `public boolean hasMore()`
- `public java.lang.String toString(java.lang.Class<? extends java.lang.Enum<?>> side)`