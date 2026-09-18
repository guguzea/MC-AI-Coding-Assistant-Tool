# IResourcePack

## Class signature

```java
public interface IResourcePack
```

## Methods

- `java.io.InputStream getInputStream( ResourceLocation location) throws java.io.IOException`
- `boolean resourceExists( ResourceLocation location)`
- `java.util.Set<java.lang.String> getResourceDomains()`
- `<T extends IMetadataSection > T getPackMetadata( IMetadataSerializer p_135058_1_, java.lang.String p_135058_2_) throws java.io.IOException`
- `java.awt.image.BufferedImage getPackImage() throws java.io.IOException`
- `java.lang.String getPackName()`