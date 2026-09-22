# MetadataSerializer

**Inheritance:** java.lang.Object → net.minecraft.client.resources.data.MetadataSerializer

## Class signature

```java
public class MetadataSerializer extends java.lang.Object
```

## Constructors

- `MetadataSerializer()`

## Methods

- `<T extends IMetadataSection> T parseMetadataSection(java.lang.String sectionName, JsonObject json)`
- `<T extends IMetadataSection> void registerMetadataSectionType(IMetadataSectionSerializer<T> metadataSectionSerializer, java.lang.Class<T> clazz)`