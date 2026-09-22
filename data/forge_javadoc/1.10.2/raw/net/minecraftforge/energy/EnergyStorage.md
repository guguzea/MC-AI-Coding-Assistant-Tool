---
title: "EnergyStorage"
description: "public class EnergyStorage extends java.lang.Object implements IEnergyStorage"
package: "net/minecraftforge/energy"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/energy/EnergyStorage.html"
sourceType: javadoc
---

# EnergyStorage

**Inheritance:** java.lang.Object → net.minecraftforge.energy.EnergyStorage

## Class signature

```java
public class EnergyStorage extends java.lang.Object implements IEnergyStorage
```

## Constructors

- `EnergyStorage(int capacity)`
- `EnergyStorage(int capacity, int maxTransfer)`
- `EnergyStorage(int capacity, int maxReceive, int maxExtract)`

## Methods

- `boolean canExtract()` — Returns if this storage can have energy extracted.
- `boolean canReceive()` — Used to determine if this storage can receive energy.
- `int extractEnergy(int maxExtract, boolean simulate)` — Removes energy from the storage.
- `int getEnergyStored()` — Returns the amount of energy currently stored.
- `int getMaxEnergyStored()` — Returns the maximum amount of energy that can be stored.
- `int receiveEnergy(int maxReceive, boolean simulate)` — Adds energy to the storage.

## Fields

- `protected int capacity`
- `protected int energy`
- `protected int maxExtract`
- `protected int maxReceive`
