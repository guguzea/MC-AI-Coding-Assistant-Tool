---
title: "FMLModContainer"
description: "Attach this mod to it's metadata from the supplied metadata collection"
package: "net/minecraftforge/fml/common"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/FMLModContainer.html"
sourceType: javadoc
---

# FMLModContainer

## Class signature

```java
public class FMLModContainer extends java.lang.Object implements ModContainer
```

## Constructors

- `public FMLModContainer(java.lang.String className, ModCandidate container, java.util.Map<java.lang.String,java.lang.Object> modDescriptor)`

## Methods

- `public java.lang.String getModId()`
- `public java.lang.String getName()`
- `public java.lang.String getVersion()`
- `public java.io.File getSource()`
- `public ModMetadata getMetadata()`
- `public void bindMetadata( MetadataCollection mc)`
- `public java.util.Properties searchForVersionProperties()`
- `public void setEnabledState(boolean enabled)`
- `public java.util.Set< ArtifactVersion > getRequirements()`
- `public java.util.List< ArtifactVersion > getDependencies()`
- `public java.util.List< ArtifactVersion > getDependants()`
- `public java.lang.String getSortingRules()`
- `public boolean matches(java.lang.Object mod)`
- `public java.lang.Object getMod()`
- `public boolean registerBus(com.google.common.eventbus.EventBus bus, LoadController controller)`
- `public void constructMod( FMLConstructionEvent event)`
- `public void handleModStateEvent( FMLEvent event)`
- `public ArtifactVersion getProcessedVersion()`
- `public boolean isImmutable()`
- `public java.lang.String getDisplayVersion()`
- `public VersionRange acceptableMinecraftVersionRange()`
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
- `public void setClassVersion(int classVersion)`
- `public int getClassVersion()`

## Description

Attach this mod to it's metadata from the supplied metadata collection
