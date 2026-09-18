---
title: "NetworkPlayerInfo"
description: "public class NetworkPlayerInfo extends java.lang.Object"
package: "net/minecraft/client/network"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/network/NetworkPlayerInfo.html"
sourceType: javadoc
---

# NetworkPlayerInfo

## Class signature

```java
public class NetworkPlayerInfo extends java.lang.Object
```

## Constructors

- `public NetworkPlayerInfo(GameProfile profile)`

## Methods

- `public GameProfile getGameProfile()`
- `public GameType getGameType()`
- `protected void setGameType( GameType gameMode)`
- `public int getResponseTime()`
- `protected void setResponseTime(int latency)`
- `public boolean hasLocationSkin()`
- `public java.lang.String getSkinType()`
- `public ResourceLocation getLocationSkin()`
- `public ResourceLocation getLocationCape()`
- `public ResourceLocation getLocationElytra()`
- `public ScorePlayerTeam getPlayerTeam()`
- `protected void loadPlayerTextures()`
- `public void setDisplayName( ITextComponent displayNameIn)`
- `public ITextComponent getDisplayName()`
- `public int getLastHealth()`
- `public void setLastHealth(int p_178836_1_)`
- `public int getDisplayHealth()`
- `public void setDisplayHealth(int p_178857_1_)`
- `public long getLastHealthTime()`
- `public void setLastHealthTime(long p_178846_1_)`
- `public long getHealthBlinkTime()`
- `public void setHealthBlinkTime(long p_178844_1_)`
- `public long getRenderVisibilityId()`
- `public void setRenderVisibilityId(long p_178843_1_)`
