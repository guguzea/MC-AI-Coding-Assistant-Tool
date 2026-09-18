# IEnergyStorage

## Class signature

```java
public interface IEnergyStorage
```

## Methods

- `int receiveEnergy(int maxReceive, boolean simulate)`
- `int extractEnergy(int maxExtract, boolean simulate)`
- `int getEnergyStored()`
- `int getMaxEnergyStored()`
- `boolean canExtract()`
- `boolean canReceive()`

## Description

An energy storage is the unit of interaction with Energy inventories. A reference implementation can be found at EnergyStorage . Derived from the Redstone Flux power system designed by King Lemming an