# B3DModel.Vertex

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.b3d.B3DModel.Vertex

## Class signature

```java
public static class B3DModel.Vertex extends java.lang.Object
```

## Constructors

- `Vertex(javax.vecmath.Vector3f pos, javax.vecmath.Vector3f normal, javax.vecmath.Vector4f color, javax.vecmath.Vector4f[] texCoords)`

## Methods

- `B3DModel.Vertex bake(B3DModel.Mesh mesh, com.google.common.base.Function<B3DModel.Node<?>, javax.vecmath.Matrix4f> animator)`
- `javax.vecmath.Vector4f getColor()`
- `javax.vecmath.Vector3f getNormal()`
- `javax.vecmath.Vector3f getPos()`
- `javax.vecmath.Vector4f[] getTexCoords()`
- `java.lang.String toString()`