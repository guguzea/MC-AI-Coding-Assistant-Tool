# DefaultResourcePack

## Class signature

```java
public class DefaultResourcePack extends java.lang.Object implements IResourcePack
```

## Constructors

- `public DefaultResourcePack( ResourceIndex resourceIndexIn)`

## Methods

- `public java.io.InputStream getInputStream( ResourceLocation location) throws java.io.IOException`
- `@Nullable public java.io.InputStream getInputStreamAssets( ResourceLocation location) throws java.io.IOException, java.io.FileNotFoundException`
- `public boolean resourceExists( ResourceLocation location)`
- `public java.util.Set<java.lang.String> getResourceDomains()`
- `@Nullable public <T extends IMetadataSection > T getPackMetadata( MetadataSerializer metadataSerializer, java.lang.String metadataSectionName) throws java.io.IOException`
- `public java.awt.image.BufferedImage getPackImage() throws java.io.IOException`
- `public java.lang.String getPackName()`