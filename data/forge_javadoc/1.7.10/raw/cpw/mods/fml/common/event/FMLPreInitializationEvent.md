---
title: "FMLPreInitializationEvent"
description: "public class FMLPreInitializationEvent extends FMLStateEvent"
package: "cpw/mods/fml/common/event"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/event/FMLPreInitializationEvent.html"
sourceType: javadoc
---

# FMLPreInitializationEvent

**Inheritance:** java.lang.Object → cpw.mods.fml.common.event.FMLEvent → cpw.mods.fml.common.event.FMLStateEvent → cpw.mods.fml.common.event.FMLPreInitializationEvent

## Class signature

```java
public class FMLPreInitializationEvent extends FMLStateEvent
```

## Constructors

- `FMLPreInitializationEvent(java.lang.Object... data)`

## Methods

- `void applyModContainer(ModContainer activeContainer)`
- `ASMDataTable getAsmData()`
- `@Deprecated java.security.cert.Certificate[] getFMLSigningCertificates()`
- `java.io.File getModConfigurationDirectory()`
- `Logger getModLog()` — Get a logger instance configured to write to the FML Log as a parent, identified by modid.
- `ModMetadata getModMetadata()`
- `LoaderState.ModState getModState()`
- `java.io.File getSourceFile()`
- `java.io.File getSuggestedConfigurationFile()`
- `java.util.Properties getVersionProperties()`
