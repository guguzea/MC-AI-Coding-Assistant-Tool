---
title: "FMLPreInitializationEvent"
description: "Called before FMLInitializationEvent during mod startup. This is the first of three commonly called events during mod initialization. Recommended activities: Setup your logging getModLog() Load any co"
package: "net/minecraftforge/fml/common/event"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/event/FMLPreInitializationEvent.html"
sourceType: javadoc
---

# FMLPreInitializationEvent

## Class signature

```java
public class FMLPreInitializationEvent extends FMLStateEvent
```

## Constructors

- `public FMLPreInitializationEvent(java.lang.Object... data)`

## Methods

- `public LoaderState.ModState getModState()`
- `public void applyModContainer( ModContainer activeContainer)`
- `public java.io.File getSourceFile()`
- `public ModMetadata getModMetadata()`
- `public java.io.File getModConfigurationDirectory()`
- `public java.io.File getSuggestedConfigurationFile()`
- `public ASMDataTable getAsmData()`
- `public java.util.Properties getVersionProperties()`
- `public org.apache.logging.log4j.Logger getModLog()`
- `@Deprecated public java.security.cert.Certificate[] getFMLSigningCertificates()`

## Description

Called before FMLInitializationEvent during mod startup. This is the first of three commonly called events during mod initialization. Recommended activities: Setup your logging getModLog() Load any co
