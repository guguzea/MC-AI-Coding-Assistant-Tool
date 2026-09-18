# MetadataSerializer

## Class signature

```java
public class MetadataSerializer extends java.lang.Object
```

## Constructors

- `public MetadataSerializer()`

## Methods

- `public <T extends IMetadataSection > void registerMetadataSectionType( IMetadataSectionSerializer <T> metadataSectionSerializer, java.lang.Class<T> clazz)`
- `public <T extends IMetadataSection > T parseMetadataSection(java.lang.String sectionName, JsonObject json)`