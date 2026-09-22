---
title: "NBTUtil"
description: "public final class NBTUtil extends java.lang.Object"
package: "net/minecraft/nbt"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/nbt/NBTUtil.html"
sourceType: javadoc
---

# NBTUtil

**Inheritance:** java.lang.Object → net.minecraft.nbt.NBTUtil

## Class signature

```java
public final class NBTUtil extends java.lang.Object
```

## Constructors

- `NBTUtil()`

## Methods

- `static boolean areNBTEquals(NBTBase nbt1, NBTBase nbt2, boolean compareTagList)`
- `static NBTTagCompound createPosTag(BlockPos pos)`
- `static NBTTagCompound createUUIDTag(java.util.UUID uuid)`
- `static BlockPos getPosFromTag(NBTTagCompound tag)`
- `static java.util.UUID getUUIDFromTag(NBTTagCompound tag)`
- `static IBlockState readBlockState(NBTTagCompound tag)`
- `static com.mojang.authlib.GameProfile readGameProfileFromNBT(NBTTagCompound compound)`
- `static NBTTagCompound writeBlockState(NBTTagCompound tag, IBlockState state)`
- `static NBTTagCompound writeGameProfile(NBTTagCompound tagCompound, com.mojang.authlib.GameProfile profile)`
