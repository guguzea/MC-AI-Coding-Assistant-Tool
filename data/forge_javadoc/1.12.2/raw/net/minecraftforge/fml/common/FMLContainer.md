---
title: "FMLContainer"
description: "Get the actual mod object"
package: "net/minecraftforge/fml/common"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/FMLContainer.html"
sourceType: javadoc
---

# FMLContainer

## Class signature

```java
public final class FMLContainer extends DummyModContainer implements WorldAccessContainer
```

## Constructors

- `public FMLContainer()`

## Methods

- `public boolean registerBus(EventBus bus, LoadController controller)`
- `public void modConstruction( FMLConstructionEvent evt)`
- `public void modPreinitialization( FMLPreInitializationEvent evt)`
- `public boolean checkModLists(java.util.Map<java.lang.String,java.lang.String> modList, Side side)`
- `public NBTTagCompound getDataForWriting( SaveHandler handler, WorldInfo info)`
- `public void readData( SaveHandler handler, WorldInfo info, java.util.Map<java.lang.String, NBTBase > propertyMap, NBTTagCompound tag)`
- `public java.security.cert.Certificate getSigningCertificate()`
- `public java.io.File getSource()`
- `public java.lang.Class<?> getCustomResourcePackClass()`
- `public java.lang.String getGuiClassName()`
- `public java.lang.Object getMod()`

## Description

Get the actual mod object
