---
title: "FMLContainer"
description: "public class FMLContainer extends DummyModContainer implements WorldAccessContainer"
package: "cpw/mods/fml/common"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/FMLContainer.html"
sourceType: javadoc
---

# FMLContainer

**Inheritance:** java.lang.Object → cpw.mods.fml.common.DummyModContainer → cpw.mods.fml.common.FMLContainer

## Class signature

```java
public class FMLContainer extends DummyModContainer implements WorldAccessContainer
```

## Methods

- `boolean checkModLists(java.util.Map<java.lang.String, java.lang.String> modList, Side side)`
- `java.lang.Class<?> getCustomResourcePackClass()`
- `NBTTagCompound getDataForWriting(SaveHandler handler, WorldInfo info)`
- `java.lang.String getGuiClassName()`
- `java.lang.Object getMod()` — Get the actual mod object
- `java.security.cert.Certificate getSigningCertificate()`
- `java.io.File getSource()` — The location on the file system which this mod came from
- `void modConstruction(FMLConstructionEvent evt)`
- `void readData(SaveHandler handler, WorldInfo info, java.util.Map<java.lang.String, NBTBase> propertyMap, NBTTagCompound tag)`
- `boolean registerBus(EventBus bus, LoadController controller)` — Register the event bus for the mod and the controller for error handling Returns if this bus was successfully registered - disabled mods and other mods that don't need real events should return false and avoid further processing

## Fields

- `FMLContainer`
