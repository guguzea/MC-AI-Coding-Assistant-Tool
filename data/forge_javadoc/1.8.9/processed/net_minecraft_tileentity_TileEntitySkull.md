# TileEntitySkull

## Class signature

```java
public class TileEntitySkull extends TileEntity
```

## Constructors

- `public TileEntitySkull()`

## Methods

- `public void writeToNBT( NBTTagCompound compound)`
- `public void readFromNBT( NBTTagCompound compound)`
- `public GameProfile getPlayerProfile()`
- `public Packet getDescriptionPacket()`
- `public void setType(int type)`
- `public void setPlayerProfile(GameProfile playerProfile)`
- `public static GameProfile updateGameprofile(GameProfile input)`
- `public int getSkullType()`
- `public int getSkullRotation()`
- `public void setSkullRotation(int rotation)`

## Description

Allows for a specialized description packet to be created.