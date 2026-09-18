---
title: "IEnergyStorage"
description: "An energy storage is the unit of interaction with Energy inventories. A reference implementation can be found at EnergyStorage . Derived from the Redstone Flux power system designed by King Lemming an"
package: "net/minecraftforge/energy"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/energy/IEnergyStorage.html"
sourceType: javadoc
---

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
