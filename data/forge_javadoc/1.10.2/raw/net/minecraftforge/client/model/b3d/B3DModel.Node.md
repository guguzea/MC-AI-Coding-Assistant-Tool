---
title: "B3DModel.Node"
description: ""
package: "net/minecraftforge/client/model/b3d"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/client/model/b3d/B3DModel.Node.html"
sourceType: javadoc
---

# B3DModel.Node

## Constructors

- `public Node(java.lang.String name, javax.vecmath.Vector3f pos, javax.vecmath.Vector3f scale, javax.vecmath.Quat4f rot, java.util.List< B3DModel.Node <?>> nodes, K kind)`

## Methods

- `public static <K extends B3DModel.IKind <K>> B3DModel.Node <K> create(java.lang.String name, javax.vecmath.Vector3f pos, javax.vecmath.Vector3f scale, javax.vecmath.Quat4f rot, java.util.List< B3DModel.Node <?>> nodes, K kind)`
- `public void setAnimation( B3DModel.Animation animation)`
- `public void setAnimation(org.apache.commons.lang3.tuple.Triple<java.lang.Integer,java.lang.Integer,java.lang.Float> animData, com.google.common.collect.Table<java.lang.Integer,com.google.common.base.Optional< B3DModel.Node <?>>, B3DModel.Key > keyData)`
- `public java.lang.String getName()`
- `public K getKind()`
- `public javax.vecmath.Vector3f getPos()`
- `public javax.vecmath.Vector3f getScale()`
- `public javax.vecmath.Quat4f getRot()`
- `public com.google.common.collect.ImmutableMap<java.lang.String, B3DModel.Node <?>> getNodes()`
- `public B3DModel.Animation getAnimation()`
- `public B3DModel.Node <? extends B3DModel.IKind <?>> getParent()`
- `public void setParent( B3DModel.Node <? extends B3DModel.IKind <?>> parent)`
- `public java.lang.String toString()`
