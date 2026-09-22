# SimpleReloadableResourceManager

**Inheritance:** java.lang.Object → net.minecraft.client.resources.SimpleReloadableResourceManager

## Class signature

```java
public class SimpleReloadableResourceManager extends java.lang.Object implements IReloadableResourceManager
```

## Constructors

- `SimpleReloadableResourceManager(IMetadataSerializer rmMetadataSerializerIn)`

## Methods

- `java.util.List<IResource> getAllResources(ResourceLocation location)`
- `IResource getResource(ResourceLocation location)`
- `java.util.Set<java.lang.String> getResourceDomains()`
- `void registerReloadListener(IResourceManagerReloadListener reloadListener)`
- `void reloadResourcePack(IResourcePack resourcePack)`
- `void reloadResources(java.util.List<IResourcePack> p_110541_1_)`