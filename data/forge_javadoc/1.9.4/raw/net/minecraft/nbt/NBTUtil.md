---
title: "NBTUtil"
description: "public final class NBTUtil extends java.lang.Object"
package: "net/minecraft/nbt"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/nbt/NBTUtil.html"
sourceType: javadoc
---

# NBTUtil

## Class signature

```java
public final class NBTUtil extends java.lang.Object
```

## Constructors

- `public NBTUtil()`

## Methods

- `@Nullable public static com.mojang.authlib.GameProfile readGameProfileFromNBT( NBTTagCompound compound)`
- `public static NBTTagCompound writeGameProfile( NBTTagCompound tagCompound, com.mojang.authlib.GameProfile profile)`
- `public static boolean areNBTEquals( NBTBase nbt1, NBTBase nbt2, boolean compareTagList)`
- `public static NBTTagCompound createUUIDTag(java.util.UUID uuid)`
- `public static java.util.UUID getUUIDFromTag( NBTTagCompound tag)`
- `public static BlockPos getPosFromTag( NBTTagCompound tag)`
- `public static NBTTagCompound createPosTag( BlockPos pos)`
