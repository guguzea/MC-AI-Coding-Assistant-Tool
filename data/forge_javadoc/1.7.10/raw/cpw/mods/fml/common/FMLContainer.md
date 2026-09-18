---
title: "FMLContainer"
description: "Get the actual mod object"
package: "cpw/mods/fml/common"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/FMLContainer.html"
sourceType: javadoc
---

# FMLContainer

## Class signature

```java
public class FMLContainer extends DummyModContainer implements WorldAccessContainer
```

## Constructors

- `public FMLContainer()`

## Methods

- `public boolean registerBus(EventBus bus, LoadController controller)`
- `public void modConstruction( FMLConstructionEvent evt)`
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
