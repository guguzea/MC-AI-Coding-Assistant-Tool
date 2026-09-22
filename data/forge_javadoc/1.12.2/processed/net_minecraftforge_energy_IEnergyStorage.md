# IEnergyStorage

## Class signature

```java
public interface IEnergyStorage
```

## Methods

- `boolean canExtract()` — Returns if this storage can have energy extracted.
- `boolean canReceive()` — Used to determine if this storage can receive energy.
- `int extractEnergy(int maxExtract, boolean simulate)` — Removes energy from the storage.
- `int getEnergyStored()` — Returns the amount of energy currently stored.
- `int getMaxEnergyStored()` — Returns the maximum amount of energy that can be stored.
- `int receiveEnergy(int maxReceive, boolean simulate)` — Adds energy to the storage.