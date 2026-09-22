---
title: "FMLContainer"
description: "public class FMLContainer extends DummyModContainer implements WorldAccessContainer"
package: "net/minecraftforge/fml/common"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/FMLContainer.html"
sourceType: javadoc
---

# FMLContainer

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.DummyModContainer → net.minecraftforge.fml.common.FMLContainer

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
- `void modPreinitialization(FMLPreInitializationEvent evt)`
- `void readData(SaveHandler handler, WorldInfo info, java.util.Map<java.lang.String, NBTBase> propertyMap, NBTTagCompound tag)`
- `boolean registerBus(EventBus bus, LoadController controller)` — Register the event bus for the mod and the controller for error handling Returns if this bus was successfully registered - disabled mods and other mods that don't need real events should return false and avoid further processing

## Fields

- `FMLContainer`
