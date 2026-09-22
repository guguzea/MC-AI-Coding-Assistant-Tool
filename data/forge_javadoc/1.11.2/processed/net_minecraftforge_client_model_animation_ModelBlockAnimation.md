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