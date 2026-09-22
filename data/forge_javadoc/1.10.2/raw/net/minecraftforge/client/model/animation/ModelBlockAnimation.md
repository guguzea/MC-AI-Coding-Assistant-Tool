---
title: "ModelBlockAnimation"
description: "public class ModelBlockAnimation extends java.lang.Object"
package: "net/minecraftforge/client/model/animation"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/client/model/animation/ModelBlockAnimation.html"
sourceType: javadoc
---

# ModelBlockAnimation

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.animation.ModelBlockAnimation

## Class signature

```java
public class ModelBlockAnimation extends java.lang.Object
```

## Constructors

- `ModelBlockAnimation(com.google.common.collect.ImmutableMap<java.lang.String, com.google.common.collect.ImmutableMap<java.lang.String, float[]>> joints, com.google.common.collect.ImmutableMap<java.lang.String, ModelBlockAnimation.MBClip> clips)`

## Methods

- `com.google.common.collect.ImmutableMap<java.lang.String, ModelBlockAnimation.MBClip> getClips()`
- `com.google.common.collect.ImmutableCollection<ModelBlockAnimation.MBJointWeight> getJoint(int i)`
- `TRSRTransformation getPartTransform(IModelState state, BlockPart part, int i)`
- `static ModelBlockAnimation loadVanillaAnimation(IResourceManager manager, ResourceLocation armatureLocation)` — Load armature associated with a vanilla model.
