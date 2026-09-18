---
title: "NibbleArray"
description: "Returns the nibble of data corresponding to the passed in x, y, z. y is at most 6 bits, z is at most 4."
package: "net/minecraft/world/chunk"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/chunk/NibbleArray.html"
sourceType: javadoc
---

# NibbleArray

## Class signature

```java
public class NibbleArray extends java.lang.Object
```

## Constructors

- `public NibbleArray()`
- `public NibbleArray(byte[] storageArray)`

## Methods

- `public int get(int x, int y, int z)`
- `public void set(int x, int y, int z, int value)`
- `public int getFromIndex(int index)`
- `public void setIndex(int index, int value)`
- `public byte[] getData()`

## Description

Returns the nibble of data corresponding to the passed in x, y, z. y is at most 6 bits, z is at most 4.
