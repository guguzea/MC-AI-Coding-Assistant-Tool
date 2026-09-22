# ItemCameraTransforms

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.block.model.ItemCameraTransforms

## Class signature

```java
public class ItemCameraTransforms extends java.lang.Object
```

## Constructors

- `@Deprecated ItemCameraTransforms(ItemCameraTransforms transforms)`
- `@Deprecated ItemCameraTransforms(ItemTransformVec3f p_i46569_1_, ItemTransformVec3f p_i46569_2_, ItemTransformVec3f p_i46569_3_, ItemTransformVec3f p_i46569_4_, ItemTransformVec3f p_i46569_5_, ItemTransformVec3f p_i46569_6_, ItemTransformVec3f p_i46569_7_, ItemTransformVec3f p_i46569_8_)`

## Methods

- `void applyTransform(ItemCameraTransforms.TransformType type)`
- `static void applyTransformSide(ItemTransformVec3f vec, boolean leftHand)`
- `@Deprecated ItemTransformVec3f getTransform(ItemCameraTransforms.TransformType type)`
- `boolean hasCustomTransform(ItemCameraTransforms.TransformType type)`

## Fields

- `static ItemCameraTransforms DEFAULT`
- `ItemTransformVec3f firstperson_left`
- `ItemTransformVec3f firstperson_right`
- `ItemTransformVec3f fixed`
- `ItemTransformVec3f ground`
- `ItemTransformVec3f gui`
- `ItemTransformVec3f head`
- `static float offsetRotationX`
- `static float offsetRotationY`
- `static float offsetRotationZ`
- `static float offsetScaleX`
- `static float offsetScaleY`
- `static float offsetScaleZ`
- `static float offsetTranslateX`
- `static float offsetTranslateY`
- `static float offsetTranslateZ`
- `ItemTransformVec3f thirdperson_left`
- `ItemTransformVec3f thirdperson_right`