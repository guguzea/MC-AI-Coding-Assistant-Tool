---
title: "NetworkPlayerInfo"
description: "public class NetworkPlayerInfo extends java.lang.Object"
package: "net/minecraft/client/network"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/network/NetworkPlayerInfo.html"
sourceType: javadoc
---

# NetworkPlayerInfo

**Inheritance:** java.lang.Object → net.minecraft.client.network.NetworkPlayerInfo

## Class signature

```java
public class NetworkPlayerInfo extends java.lang.Object
```

## Constructors

- `NetworkPlayerInfo(com.mojang.authlib.GameProfile profile)`
- `NetworkPlayerInfo(SPacketPlayerListItem.AddPlayerData entry)`

## Methods

- `int getDisplayHealth()`
- `ITextComponent getDisplayName()`
- `com.mojang.authlib.GameProfile getGameProfile()`
- `WorldSettings.GameType getGameType()`
- `long getHealthBlinkTime()`
- `int getLastHealth()`
- `long getLastHealthTime()`
- `ResourceLocation getLocationCape()`
- `ResourceLocation getLocationElytra()`
- `ResourceLocation getLocationSkin()`
- `ScorePlayerTeam getPlayerTeam()`
- `long getRenderVisibilityId()`
- `int getResponseTime()`
- `java.lang.String getSkinType()`
- `boolean hasLocationSkin()`
- `protected void loadPlayerTextures()`
- `void setDisplayHealth(int p_178857_1_)`
- `void setDisplayName(ITextComponent displayNameIn)`
- `protected void setGameType(WorldSettings.GameType gameMode)`
- `void setHealthBlinkTime(long p_178844_1_)`
- `void setLastHealth(int p_178836_1_)`
- `void setLastHealthTime(long p_178846_1_)`
- `void setRenderVisibilityId(long p_178843_1_)`
- `protected void setResponseTime(int latency)`
