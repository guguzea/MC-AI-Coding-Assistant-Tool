# TileEntityMobSpawner

## Class signature

```java
public class TileEntityMobSpawner extends TileEntity implements ITickable
```

## Constructors

- `public TileEntityMobSpawner()`

## Methods

- `public void readFromNBT( NBTTagCompound compound)`
- `public void writeToNBT( NBTTagCompound compound)`
- `public void update()`
- `public Packet getDescriptionPacket()`
- `public boolean receiveClientEvent(int id, int type)`
- `public boolean func_183000_F()`
- `public MobSpawnerBaseLogic getSpawnerBaseLogic()`

## Description

Allows for a specialized description packet to be created.