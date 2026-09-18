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