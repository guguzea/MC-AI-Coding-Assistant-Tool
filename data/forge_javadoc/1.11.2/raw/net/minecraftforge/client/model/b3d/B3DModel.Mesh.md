---
title: "B3DModel.Mesh"
description: "public static class B3DModel.Mesh extends java.lang.Object implements B3DModel.IKind<B3DModel.Mesh>"
package: "net/minecraftforge/client/model/b3d"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/client/model/b3d/B3DModel.Mesh.html"
sourceType: javadoc
---

# B3DModel.Mesh

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.b3d.B3DModel.Mesh

## Class signature

```java
public static class B3DModel.Mesh extends java.lang.Object implements B3DModel.IKind<B3DModel.Mesh>
```

## Constructors

- `Mesh(org.apache.commons.lang3.tuple.Pair<B3DModel.Brush, java.util.List<B3DModel.Face>> data)`

## Methods

- `com.google.common.collect.ImmutableList<B3DModel.Face> bake(com.google.common.base.Function<B3DModel.Node<?>, javax.vecmath.Matrix4f> animator)`
- `com.google.common.collect.ImmutableSet<B3DModel.Node<B3DModel.Bone>> getBones()`
- `B3DModel.Brush getBrush()`
- `com.google.common.collect.ImmutableList<B3DModel.Face> getFaces()`
- `B3DModel.Node<B3DModel.Mesh> getParent()`
- `com.google.common.collect.ImmutableMultimap<B3DModel.Vertex, org.apache.commons.lang3.tuple.Pair<java.lang.Float, B3DModel.Node<B3DModel.Bone>>> getWeightMap()`
- `void setParent(B3DModel.Node<B3DModel.Mesh> parent)`
- `java.lang.String toString()`
