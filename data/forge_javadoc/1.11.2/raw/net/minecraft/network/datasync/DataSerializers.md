---
title: "DataSerializers"
description: "public class DataSerializers extends java.lang.Object"
package: "net/minecraft/network/datasync"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/datasync/DataSerializers.html"
sourceType: javadoc
---

# DataSerializers

**Inheritance:** java.lang.Object → net.minecraft.network.datasync.DataSerializers

## Class signature

```java
public class DataSerializers extends java.lang.Object
```

## Constructors

- `DataSerializers()`

## Methods

- `static DataSerializer<?> getSerializer(int id)`
- `static int getSerializerId(DataSerializer<?> serializer)`
- `static void registerSerializer(DataSerializer<?> serializer)`

## Fields

- `static DataSerializer<BlockPos> BLOCK_POS`
- `static DataSerializer<java.lang.Boolean> BOOLEAN`
- `static DataSerializer<java.lang.Byte> BYTE`
- `static DataSerializer<EnumFacing> FACING`
- `static DataSerializer<java.lang.Float> FLOAT`
- `static DataSerializer<com.google.common.base.Optional<BlockPos>> OPTIONAL_BLOCK_POS`
- `static DataSerializer<com.google.common.base.Optional<IBlockState>> OPTIONAL_BLOCK_STATE`
- `static DataSerializer<ItemStack> OPTIONAL_ITEM_STACK`
- `static DataSerializer<com.google.common.base.Optional<java.util.UUID>> OPTIONAL_UNIQUE_ID`
- `static DataSerializer<Rotations> ROTATIONS`
- `static DataSerializer<java.lang.String> STRING`
- `static DataSerializer<ITextComponent> TEXT_COMPONENT`
- `static DataSerializer<java.lang.Integer> VARINT`
