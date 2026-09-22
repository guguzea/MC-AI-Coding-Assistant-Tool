# B3DModel.Face

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.b3d.B3DModel.Face

## Class signature

```java
public static class B3DModel.Face extends java.lang.Object
```

## Constructors

- `Face(B3DModel.Vertex v1, B3DModel.Vertex v2, B3DModel.Vertex v3, B3DModel.Brush brush)`
- `Face(B3DModel.Vertex v1, B3DModel.Vertex v2, B3DModel.Vertex v3, B3DModel.Brush brush, Vector3f normal)`

## Methods

- `B3DModel.Brush getBrush()`
- `Vector3f getNormal()`
- `static Vector3f getNormal(B3DModel.Vertex v1, B3DModel.Vertex v2, B3DModel.Vertex v3)`
- `B3DModel.Vertex getV1()`
- `B3DModel.Vertex getV2()`
- `B3DModel.Vertex getV3()`
- `java.lang.String toString()`