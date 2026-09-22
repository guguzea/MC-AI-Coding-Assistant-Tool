---
title: "MinecraftDummyContainer"
description: "public class MinecraftDummyContainer extends DummyModContainer"
package: "net/minecraftforge/fml/common"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/MinecraftDummyContainer.html"
sourceType: javadoc
---

# MinecraftDummyContainer

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.DummyModContainer → net.minecraftforge.fml.common.MinecraftDummyContainer

## Class signature

```java
public class MinecraftDummyContainer extends DummyModContainer
```

## Methods

- `java.security.cert.Certificate getSigningCertificate()`
- `java.io.File getSource()` — The location on the file system which this mod came from
- `VersionRange getStaticVersionRange()`
- `boolean isImmutable()`
- `boolean registerBus(com.google.common.eventbus.EventBus bus, LoadController controller)` — Register the event bus for the mod and the controller for error handling Returns if this bus was successfully registered - disabled mods and other mods that don't need real events should return false and avoid further processing

## Fields

- `MinecraftDummyContainer`
