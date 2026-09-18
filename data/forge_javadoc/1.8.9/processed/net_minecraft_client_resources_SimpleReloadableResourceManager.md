# SimpleReloadableResourceManager

## Class signature

```java
public class SimpleReloadableResourceManager extends java.lang.Object implements IReloadableResourceManager
```

## Constructors

- `public SimpleReloadableResourceManager( IMetadataSerializer rmMetadataSerializerIn)`

## Methods

- `public void reloadResourcePack( IResourcePack resourcePack)`
- `public java.util.Set<java.lang.String> getResourceDomains()`
- `public IResource getResource( ResourceLocation location) throws java.io.IOException`
- `public java.util.List< IResource > getAllResources( ResourceLocation location) throws java.io.IOException`
- `public void reloadResources(java.util.List< IResourcePack > p_110541_1_)`
- `public void registerReloadListener( IResourceManagerReloadListener reloadListener)`