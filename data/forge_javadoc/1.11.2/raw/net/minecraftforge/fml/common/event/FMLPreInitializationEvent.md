---
title: "FMLPreInitializationEvent"
description: "public class FMLPreInitializationEvent extends FMLStateEvent"
package: "net/minecraftforge/fml/common/event"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/event/FMLPreInitializationEvent.html"
sourceType: javadoc
---

# FMLPreInitializationEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.event.FMLEvent → net.minecraftforge.fml.common.event.FMLStateEvent → net.minecraftforge.fml.common.event.FMLPreInitializationEvent

## Class signature

```java
public class FMLPreInitializationEvent extends FMLStateEvent
```

## Constructors

- `FMLPreInitializationEvent(java.lang.Object... data)`

## Methods

- `void applyModContainer(ModContainer activeContainer)`
- `ASMDataTable getAsmData()` — Get the ASMDataTable for this instance of Minecraft.
- `@Deprecated java.security.cert.Certificate[] getFMLSigningCertificates()`
- `java.io.File getModConfigurationDirectory()` — Get the main configuration directory for this minecraft instance
- `org.apache.logging.log4j.Logger getModLog()` — Get a logger instance configured to write to the FML Log as a parent, identified by modid.
- `ModMetadata getModMetadata()` — Get the ModMetadata for this mod
- `LoaderState.ModState getModState()` — The current state of the mod
- `java.io.File getSourceFile()` — Get the File the mod was loaded from
- `java.io.File getSuggestedConfigurationFile()` — Get a suggested configuration file for this mod.
- `java.util.Properties getVersionProperties()` — Get a version.properties file as a Properties object from the mod file.
