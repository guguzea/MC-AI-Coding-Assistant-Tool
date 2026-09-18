# DummyModContainer

## Class signature

```java
public class DummyModContainer extends java.lang.Object implements ModContainer
```

## Constructors

- `public DummyModContainer( ModMetadata md)`
- `public DummyModContainer(java.lang.String label)`
- `public DummyModContainer()`

## Methods

- `public void bindMetadata( MetadataCollection mc)`
- `public java.util.List< ArtifactVersion > getDependants()`
- `public java.util.List< ArtifactVersion > getDependencies()`
- `public java.util.Set< ArtifactVersion > getRequirements()`
- `public ModMetadata getMetadata()`
- `public java.lang.Object getMod()`
- `public java.lang.String getModId()`
- `public java.lang.String getName()`
- `public java.lang.String getSortingRules()`
- `public java.io.File getSource()`
- `public java.lang.String getVersion()`
- `public boolean matches(java.lang.Object mod)`
- `public void setEnabledState(boolean enabled)`
- `public boolean registerBus(com.google.common.eventbus.EventBus bus, LoadController controller)`
- `public ArtifactVersion getProcessedVersion()`
- `public boolean isImmutable()`
- `public java.lang.String getDisplayVersion()`
- `public VersionRange acceptableMinecraftVersionRange()`
- `@Nullable public java.security.cert.Certificate getSigningCertificate()`
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