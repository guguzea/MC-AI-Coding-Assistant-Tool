# IResourcePack

## Class signature

```java
public interface IResourcePack
```

## Methods

- `java.io.InputStream getInputStream(ResourceLocation location)`
- `java.awt.image.BufferedImage getPackImage()`
- `<T extends IMetadataSection> T getPackMetadata(IMetadataSerializer p_135058_1_, java.lang.String p_135058_2_)`
- `java.lang.String getPackName()`
- `java.util.Set<java.lang.String> getResourceDomains()`
- `boolean resourceExists(ResourceLocation location)`