# SimpleResource

## Class signature

```java
public class SimpleResource extends java.lang.Object implements IResource
```

## Constructors

- `public SimpleResource(java.lang.String resourcePackNameIn, ResourceLocation srResourceLocationIn, java.io.InputStream resourceInputStreamIn, java.io.InputStream mcmetaInputStreamIn, MetadataSerializer srMetadataSerializerIn)`

## Methods

- `public ResourceLocation getResourceLocation()`
- `public java.io.InputStream getInputStream()`
- `public boolean hasMetadata()`
- `public <T extends IMetadataSection > T getMetadata(java.lang.String sectionName)`
- `public java.lang.String getResourcePackName()`
- `public boolean equals(java.lang.Object p_equals_1_)`
- `public int hashCode()`
- `public void close() throws java.io.IOException`