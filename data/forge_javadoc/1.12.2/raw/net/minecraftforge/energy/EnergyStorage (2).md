---
title: "EnergyStorage"
description: "Reference implementation of IEnergyStorage . Use/extend this or implement your own. Derived from the Redstone Flux power system designed by King Lemming and originally utilized in Thermal Expansion an"
package: "net/minecraftforge/energy"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/energy/EnergyStorage.html"
sourceType: javadoc
---

# EnergyStorage

## Class signature

```java
public class EnergyStorage extends java.lang.Object implements IEnergyStorage
```

## Constructors

- `public EnergyStorage(int capacity)`
- `public EnergyStorage(int capacity, int maxTransfer)`
- `public EnergyStorage(int capacity, int maxReceive, int maxExtract)`
- `public EnergyStorage(int capacity, int maxReceive, int maxExtract, int energy)`

## Methods

- `public int receiveEnergy(int maxReceive, boolean simulate)`
- `public int extractEnergy(int maxExtract, boolean simulate)`
- `public int getEnergyStored()`
- `public int getMaxEnergyStored()`
- `public boolean canExtract()`
- `public boolean canReceive()`

## Description

Reference implementation of IEnergyStorage . Use/extend this or implement your own. Derived from the Redstone Flux power system designed by King Lemming and originally utilized in Thermal Expansion an
