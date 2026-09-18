# NetworkPlayerInfo

## Class signature

```java
public class NetworkPlayerInfo extends java.lang.Object
```

## Constructors

- `public NetworkPlayerInfo(com.mojang.authlib.GameProfile profile)`
- `public NetworkPlayerInfo( SPacketPlayerListItem.AddPlayerData entry)`

## Methods

- `public com.mojang.authlib.GameProfile getGameProfile()`
- `public GameType getGameType()`
- `protected void setGameType( GameType gameMode)`
- `public int getResponseTime()`
- `protected void setResponseTime(int latency)`
- `public boolean hasLocationSkin()`
- `public java.lang.String getSkinType()`
- `public ResourceLocation getLocationSkin()`
- `@Nullable public ResourceLocation getLocationCape()`
- `@Nullable public ResourceLocation getLocationElytra()`
- `@Nullable public ScorePlayerTeam getPlayerTeam()`
- `protected void loadPlayerTextures()`
- `public void setDisplayName(@Nullable ITextComponent displayNameIn)`
- `@Nullable public ITextComponent getDisplayName()`
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