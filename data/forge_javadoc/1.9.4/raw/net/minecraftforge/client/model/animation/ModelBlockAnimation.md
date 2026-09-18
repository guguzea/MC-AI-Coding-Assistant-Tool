---
title: "ModelBlockAnimation"
description: "Load armature associated with a vanilla model."
package: "net/minecraftforge/client/model/animation"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/client/model/animation/ModelBlockAnimation.html"
sourceType: javadoc
---

# ModelBlockAnimation

## Class signature

```java
public class ModelBlockAnimation extends java.lang.Object
```

## Constructors

- `public ModelBlockAnimation(com.google.common.collect.ImmutableMap<java.lang.String,com.google.common.collect.ImmutableMap<java.lang.String,float[]>> joints, com.google.common.collect.ImmutableMap<java.lang.String, ModelBlockAnimation.MBClip > clips)`

## Methods

- `public com.google.common.collect.ImmutableMap<java.lang.String, ModelBlockAnimation.MBClip > getClips()`
- `public com.google.common.collect.ImmutableCollection< ModelBlockAnimation.MBJointWeight > getJoint(int i)`
- `public TRSRTransformation getPartTransform( IModelState state, BlockPart part, int i)`
- `public static ModelBlockAnimation loadVanillaAnimation( IResourceManager manager, ResourceLocation armatureLocation)`

## Description

Load armature associated with a vanilla model.
