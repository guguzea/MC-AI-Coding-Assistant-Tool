# LegacyV2Adapter

**Inheritance:** java.lang.Object → net.minecraft.client.resources.LegacyV2Adapter

## Class signature

```java
public class LegacyV2Adapter extends java.lang.Object implements IResourcePack
```

## Constructors

- `LegacyV2Adapter(IResourcePack packIn)`

## Methods

- `java.io.InputStream getInputStream(ResourceLocation location)`
- `java.awt.image.BufferedImage getPackImage()`
- `<T extends IMetadataSection> T getPackMetadata(MetadataSerializer metadataSerializer, java.lang.String metadataSectionName)`
- `java.lang.String getPackName()`
- `java.util.Set<java.lang.String> getResourceDomains()`
- `boolean resourceExists(ResourceLocation location)`