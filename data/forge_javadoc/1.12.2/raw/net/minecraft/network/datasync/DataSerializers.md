---
title: "DataSerializers"
description: "public class DataSerializers extends java.lang.Object"
package: "net/minecraft/network/datasync"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/datasync/DataSerializers.html"
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
- `@Deprecated static void registerSerializer(DataSerializer<?> serializer)`

## Fields

- `static DataSerializer<BlockPos> BLOCK_POS`
- `static DataSerializer<java.lang.Boolean> BOOLEAN`
- `static DataSerializer<java.lang.Byte> BYTE`
- `static DataSerializer<NBTTagCompound> COMPOUND_TAG`
- `static DataSerializer<EnumFacing> FACING`
- `static DataSerializer<java.lang.Float> FLOAT`
- `static DataSerializer<ItemStack> ITEM_STACK`
- `static DataSerializer<<any>> OPTIONAL_BLOCK_POS`
- `static DataSerializer<<any>> OPTIONAL_BLOCK_STATE`
- `static DataSerializer<<any>> OPTIONAL_UNIQUE_ID`
- `static DataSerializer<Rotations> ROTATIONS`
- `static DataSerializer<java.lang.String> STRING`
- `static DataSerializer<ITextComponent> TEXT_COMPONENT`
- `static DataSerializer<java.lang.Integer> VARINT`
