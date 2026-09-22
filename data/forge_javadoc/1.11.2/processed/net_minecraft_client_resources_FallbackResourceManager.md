# FallbackResourceManager

**Inheritance:** java.lang.Object → net.minecraft.client.resources.FallbackResourceManager

## Class signature

```java
public class FallbackResourceManager extends java.lang.Object implements IResourceManager
```

## Constructors

- `FallbackResourceManager(MetadataSerializer frmMetadataSerializerIn)`

## Methods

- `void addResourcePack(IResourcePack resourcePack)`
- `java.util.List<IResource> getAllResources(ResourceLocation location)`
- `protected java.io.InputStream getInputStream(ResourceLocation location, IResourcePack resourcePack)`
- `IResource getResource(ResourceLocation location)`
- `java.util.Set<java.lang.String> getResourceDomains()`

## Fields

- `protected java.util.List<IResourcePack> resourcePacks`