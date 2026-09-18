# TileEntityFlowerPot

## Class signature

```java
public class TileEntityFlowerPot extends TileEntity
```

## Constructors

- `public TileEntityFlowerPot()`
- `public TileEntityFlowerPot( Item potItem, int potData)`

## Methods

- `public void writeToNBT( NBTTagCompound compound)`
- `public void readFromNBT( NBTTagCompound compound)`
- `public Packet getDescriptionPacket()`
- `public void setFlowerPotData( Item potItem, int potData)`
- `public Item getFlowerPotItem()`
- `public int getFlowerPotData()`

## Description

Allows for a specialized description packet to be created.