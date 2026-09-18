# TileEntitySkull

## Class signature

```java
public class TileEntitySkull extends TileEntity implements ITickable
```

## Constructors

- `public TileEntitySkull()`

## Methods

- `public static void setProfileCache( PlayerProfileCache profileCacheIn)`
- `public static void setSessionService(MinecraftSessionService sessionServiceIn)`
- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public void readFromNBT( NBTTagCompound compound)`
- `public void update()`
- `public float getAnimationProgress(float p_184295_1_)`
- `public GameProfile getPlayerProfile()`
- `public SPacketUpdateTileEntity getUpdatePacket()`
- `public NBTTagCompound getUpdateTag()`
- `public void setType(int type)`
- `public void setPlayerProfile(GameProfile playerProfile)`
- `public static GameProfile updateGameprofile(GameProfile input)`
- `public int getSkullType()`
- `public int getSkullRotation()`
- `public void setSkullRotation(int rotation)`
- `public void mirror( Mirror mirrorIn)`
- `public void rotate( Rotation rotationIn)`