---
title: "TileEntitySkull"
description: "public class TileEntitySkull extends TileEntity implements ITickable"
package: "net/minecraft/tileentity"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/tileentity/TileEntitySkull.html"
sourceType: javadoc
---

# TileEntitySkull

## Class signature

```java
public class TileEntitySkull extends TileEntity implements ITickable
```

## Constructors

- `public TileEntitySkull()`

## Methods

- `public static void setProfileCache( PlayerProfileCache profileCacheIn)`
- `public static void setSessionService(com.mojang.authlib.minecraft.MinecraftSessionService sessionServiceIn)`
- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public void readFromNBT( NBTTagCompound compound)`
- `public void update()`
- `public float getAnimationProgress(float p_184295_1_)`
- `@Nullable public com.mojang.authlib.GameProfile getPlayerProfile()`
- `@Nullable public SPacketUpdateTileEntity getUpdatePacket()`
- `public NBTTagCompound getUpdateTag()`
- `public void setType(int type)`
- `public void setPlayerProfile(@Nullable com.mojang.authlib.GameProfile playerProfile)`
- `public static com.mojang.authlib.GameProfile updateGameprofile(com.mojang.authlib.GameProfile input)`
- `public int getSkullType()`
- `public int getSkullRotation()`
- `public void setSkullRotation(int rotation)`
