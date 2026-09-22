# B3DModel.Node

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.b3d.B3DModel.Node<K>

## Class signature

```java
public static class B3DModel.Node<K extends B3DModel.IKind<K>> extends java.lang.Object
```

## Constructors

- `Node(java.lang.String name, javax.vecmath.Vector3f pos, javax.vecmath.Vector3f scale, javax.vecmath.Quat4f rot, java.util.List<B3DModel.Node<?>> nodes, K kind)`

## Methods

- `static<K extends B3DModel.IKind<K>> B3DModel.Node<K> create(java.lang.String name, javax.vecmath.Vector3f pos, javax.vecmath.Vector3f scale, javax.vecmath.Quat4f rot, java.util.List<B3DModel.Node<?>> nodes, K kind)`
- `B3DModel.Animation getAnimation()`
- `K getKind()`
- `java.lang.String getName()`
- `com.google.common.collect.ImmutableMap<java.lang.String, B3DModel.Node<?>> getNodes()`
- `B3DModel.Node<? extends B3DModel.IKind<?>> getParent()`
- `javax.vecmath.Vector3f getPos()`
- `javax.vecmath.Quat4f getRot()`
- `javax.vecmath.Vector3f getScale()`
- `void setAnimation(B3DModel.Animation animation)`
- `void setAnimation(org.apache.commons.lang3.tuple.Triple<java.lang.Integer, java.lang.Integer, java.lang.Float> animData, com.google.common.collect.Table<java.lang.Integer, com.google.common.base.Optional<B3DModel.Node<?>>, B3DModel.Key> keyData)`
- `void setParent(B3DModel.Node<? extends B3DModel.IKind<?>> parent)`
- `java.lang.String toString()`