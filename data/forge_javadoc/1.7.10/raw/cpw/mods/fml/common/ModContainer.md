---
title: "ModContainer"
description: "The container that wraps around mods in the system. The philosophy is that individual mod implementation technologies should not impact the actual loading and management of mod code. This interface pr"
package: "cpw/mods/fml/common"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/ModContainer.html"
sourceType: javadoc
---

# ModContainer

## Class signature

```java
public interface ModContainer
```

## Methods

- `java.lang.String getModId()`
- `java.lang.String getName()`
- `java.lang.String getVersion()`
- `java.io.File getSource()`
- `ModMetadata getMetadata()`
- `void bindMetadata( MetadataCollection mc)`
- `void setEnabledState(boolean enabled)`
- `java.util.Set< ArtifactVersion > getRequirements()`
- `java.util.List< ArtifactVersion > getDependencies()`
- `java.util.List< ArtifactVersion > getDependants()`
- `java.lang.String getSortingRules()`
- `boolean registerBus(EventBus bus, LoadController controller)`
- `boolean matches(java.lang.Object mod)`
- `java.lang.Object getMod()`
- `ArtifactVersion getProcessedVersion()`
- `boolean isImmutable()`
- `java.lang.String getDisplayVersion()`
- `VersionRange acceptableMinecraftVersionRange()`
- `java.security.cert.Certificate getSigningCertificate()`
- `java.util.Map<java.lang.String,java.lang.String> getCustomModProperties()`
- `java.lang.Class<?> getCustomResourcePackClass()`
- `java.util.Map<java.lang.String,java.lang.String> getSharedModDescriptor()`
- `ModContainer.Disableable canBeDisabled()`
- `java.lang.String getGuiClassName()`
- `java.util.List<java.lang.String> getOwnedPackages()`

## Description

The container that wraps around mods in the system. The philosophy is that individual mod implementation technologies should not impact the actual loading and management of mod code. This interface pr
