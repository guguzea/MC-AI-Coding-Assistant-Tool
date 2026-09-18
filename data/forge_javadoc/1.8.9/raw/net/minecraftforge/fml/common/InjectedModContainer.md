---
title: "InjectedModContainer"
description: "Attach this mod to it's metadata from the supplied metadata collection"
package: "net/minecraftforge/fml/common"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/InjectedModContainer.html"
sourceType: javadoc
---

# InjectedModContainer

## Class signature

```java
public class InjectedModContainer extends java.lang.Object implements ModContainer
```

## Constructors

- `public InjectedModContainer( ModContainer mc, java.io.File source)`

## Methods

- `public java.lang.String getModId()`
- `public java.lang.String getName()`
- `public java.lang.String getVersion()`
- `public java.io.File getSource()`
- `public ModMetadata getMetadata()`
- `public void bindMetadata( MetadataCollection mc)`
- `public void setEnabledState(boolean enabled)`
- `public java.util.Set< ArtifactVersion > getRequirements()`
- `public java.util.List< ArtifactVersion > getDependencies()`
- `public java.util.List< ArtifactVersion > getDependants()`
- `public java.lang.String getSortingRules()`
- `public boolean registerBus(EventBus bus, LoadController controller)`
- `public boolean matches(java.lang.Object mod)`
- `public java.lang.Object getMod()`
- `public ArtifactVersion getProcessedVersion()`
- `public boolean isImmutable()`
- `public java.lang.String getDisplayVersion()`
- `public VersionRange acceptableMinecraftVersionRange()`
- `public WorldAccessContainer getWrappedWorldAccessContainer()`
- `public java.security.cert.Certificate getSigningCertificate()`
- `public java.lang.String toString()`
- `public java.util.Map<java.lang.String,java.lang.String> getCustomModProperties()`
- `public java.lang.Class<?> getCustomResourcePackClass()`
- `public java.util.Map<java.lang.String,java.lang.String> getSharedModDescriptor()`
- `public ModContainer.Disableable canBeDisabled()`
- `public java.lang.String getGuiClassName()`
- `public java.util.List<java.lang.String> getOwnedPackages()`
- `public boolean shouldLoadInEnvironment()`
- `public java.net.URL getUpdateUrl()`

## Description

Attach this mod to it's metadata from the supplied metadata collection
