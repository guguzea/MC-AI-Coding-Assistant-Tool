# OBJModel.Group

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.obj.OBJModel.Group

## Class signature

```java
public static class OBJModel.Group extends java.lang.Object implements IModelPart
```

## Constructors

- `Group(java.lang.String name, java.util.LinkedHashSet<OBJModel.Face> faces)`

## Methods

- `void addFace(OBJModel.Face face)`
- `void addFaces(java.util.List<OBJModel.Face> faces)`
- `java.util.LinkedHashSet<OBJModel.Face> applyTransform(<any> transform)`
- `java.util.LinkedHashSet<OBJModel.Face> getFaces()`
- `java.lang.String getName()`
- `void setFaces(java.util.LinkedHashSet<OBJModel.Face> faces)`

## Fields

- `static java.lang.String ALL`
- `static java.lang.String ALL_EXCEPT`
- `static java.lang.String DEFAULT_NAME`
- `float[] maxUVBounds`
- `float[] minUVBounds`