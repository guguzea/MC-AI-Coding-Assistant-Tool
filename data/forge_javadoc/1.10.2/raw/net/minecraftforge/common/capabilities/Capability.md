---
title: "Capability"
description: "This is the core holder object Capabilities. Each capability will have ONE instance of this class, and it will the the one passed into the ICapabilityProvider functions. The CapabilityManager is in ch"
package: "net/minecraftforge/common/capabilities"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/common/capabilities/Capability.html"
sourceType: javadoc
---

# Capability

## Class signature

```java
public class Capability<T> extends java.lang.Object
```

## Methods

- `public java.lang.String getName()`
- `public Capability.IStorage < T > getStorage()`
- `public void readNBT( T instance, EnumFacing side, NBTBase nbt)`
- `public NBTBase writeNBT( T instance, EnumFacing side)`
- `public T getDefaultInstance()`
- `public <R> R cast( T instance)`

## Description

This is the core holder object Capabilities. Each capability will have ONE instance of this class, and it will the the one passed into the ICapabilityProvider functions. The CapabilityManager is in ch
