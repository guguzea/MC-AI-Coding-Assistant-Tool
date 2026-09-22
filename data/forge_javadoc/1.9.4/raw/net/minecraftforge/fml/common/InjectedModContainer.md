---
title: "InjectedModContainer"
description: "public class InjectedModContainer extends java.lang.Object implements ModContainer"
package: "net/minecraftforge/fml/common"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/InjectedModContainer.html"
sourceType: javadoc
---

# InjectedModContainer

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.InjectedModContainer

## Class signature

```java
public class InjectedModContainer extends java.lang.Object implements ModContainer
```

## Constructors

- `InjectedModContainer(ModContainer mc, java.io.File source)`

## Methods

- `VersionRange acceptableMinecraftVersionRange()`
- `void bindMetadata(MetadataCollection mc)` — Attach this mod to it's metadata from the supplied metadata collection
- `ModContainer.Disableable canBeDisabled()`
- `int getClassVersion()`
- `java.util.Map<java.lang.String, java.lang.String> getCustomModProperties()`
- `java.lang.Class<?> getCustomResourcePackClass()`
- `java.util.List<ArtifactVersion> getDependants()` — A list of modids that should be loaded after this one.
- `java.util.List<ArtifactVersion> getDependencies()` — A list of modids that should be loaded prior to this one.
- `java.lang.String getDisplayVersion()`
- `java.lang.String getGuiClassName()`
- `ModMetadata getMetadata()` — The metadata for this mod
- `java.lang.Object getMod()` — Get the actual mod object
- `java.lang.String getModId()` — The globally unique modid for this mod
- `java.lang.String getName()` — A human readable name
- `java.util.List<java.lang.String> getOwnedPackages()`
- `ArtifactVersion getProcessedVersion()`
- `java.util.Set<ArtifactVersion> getRequirements()` — A list of the modids that this mod requires loaded prior to loading
- `java.util.Map<java.lang.String, java.lang.String> getSharedModDescriptor()`
- `java.security.cert.Certificate getSigningCertificate()`
- `java.lang.String getSortingRules()` — A representative string encapsulating the sorting preferences for this mod
- `java.io.File getSource()` — The location on the file system which this mod came from
- `java.net.URL getUpdateUrl()`
- `java.lang.String getVersion()` — A human readable version identifier
- `WorldAccessContainer getWrappedWorldAccessContainer()`
- `boolean isImmutable()`
- `boolean matches(java.lang.Object mod)` — Does this mod match the supplied mod
- `boolean registerBus(com.google.common.eventbus.EventBus bus, LoadController controller)` — Register the event bus for the mod and the controller for error handling Returns if this bus was successfully registered - disabled mods and other mods that don't need real events should return false and avoid further processing
- `void setClassVersion(int classVersion)`
- `void setEnabledState(boolean enabled)` — Set the enabled/disabled state of this mod
- `boolean shouldLoadInEnvironment()`
- `java.lang.String toString()`

## Fields

- `ModContainer wrappedContainer`
