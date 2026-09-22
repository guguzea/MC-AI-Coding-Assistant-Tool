# ResourcePackRepository

**Inheritance:** java.lang.Object → net.minecraft.client.resources.ResourcePackRepository

## Class signature

```java
public class ResourcePackRepository extends java.lang.Object
```

## Constructors

- `ResourcePackRepository(java.io.File dirResourcepacksIn, java.io.File dirServerResourcepacksIn, IResourcePack rprDefaultResourcePackIn, MetadataSerializer rprMetadataSerializerIn, GameSettings settings)`

## Methods

- `void clearResourcePack()`
- `<any> downloadResourcePack(java.lang.String url, java.lang.String hash)`
- `java.io.File getDirResourcepacks()`
- `static java.util.Map<java.lang.String, java.lang.String> getDownloadHeaders()`
- `java.util.List<ResourcePackRepository.Entry> getRepositoryEntries()`
- `java.util.List<ResourcePackRepository.Entry> getRepositoryEntriesAll()`
- `ResourcePackRepository.Entry getResourcePackEntry()`
- `IResourcePack getServerResourcePack()`
- `void setRepositories(java.util.List<ResourcePackRepository.Entry> repositories)`
- `<any> setServerResourcePack(java.io.File resourceFile)`
- `void updateRepositoryEntriesAll()`

## Fields

- `IResourcePack rprDefaultResourcePack`
- `MetadataSerializer rprMetadataSerializer`