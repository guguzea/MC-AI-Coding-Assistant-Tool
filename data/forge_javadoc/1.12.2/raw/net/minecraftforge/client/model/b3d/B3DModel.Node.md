---
title: "B3DModel.Node"
description: "public static class B3DModel.Node<K extends B3DModel.IKind<K>> extends java.lang.Object"
package: "net/minecraftforge/client/model/b3d"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/model/b3d/B3DModel.Node.html"
sourceType: javadoc
---

# B3DModel.Node

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.b3d.B3DModel.Node<K>

## Class signature

```java
public static class B3DModel.Node<K extends B3DModel.IKind<K>> extends java.lang.Object
```

## Constructors

- `Node(java.lang.String name, Vector3f pos, Vector3f scale, Quat4f rot, java.util.List<B3DModel.Node<?>> nodes, K kind)`

## Methods

- `static<K extends B3DModel.IKind<K>> B3DModel.Node<K> create(java.lang.String name, Vector3f pos, Vector3f scale, Quat4f rot, java.util.List<B3DModel.Node<?>> nodes, K kind)`
- `B3DModel.Animation getAnimation()`
- `K getKind()`
- `java.lang.String getName()`
- `<any> getNodes()`
- `B3DModel.Node<? extends B3DModel.IKind<?>> getParent()`
- `Vector3f getPos()`
- `Quat4f getRot()`
- `Vector3f getScale()`
- `void setAnimation(<any> animData, <any> keyData)`
- `void setAnimation(B3DModel.Animation animation)`
- `void setParent(B3DModel.Node<? extends B3DModel.IKind<?>> parent)`
- `java.lang.String toString()`
