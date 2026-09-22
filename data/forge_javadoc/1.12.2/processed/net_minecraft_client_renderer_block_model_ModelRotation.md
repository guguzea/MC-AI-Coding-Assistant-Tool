# ModelRotation

**Inheritance:** java.lang.Object → java.lang.Enum<ModelRotation> → net.minecraft.client.renderer.block.model.ModelRotation

## Class signature

```java
public enum ModelRotation extends java.lang.Enum<ModelRotation> implements IModelState, ITransformation
```

## Methods

- `java.util.Optional<TRSRTransformation> apply(java.util.Optional<? extends IModelPart> part)`
- `javax.vecmath.Matrix4f getMatrix()`
- `Matrix4f getMatrix4d()`
- `static ModelRotation getModelRotation(int x, int y)`
- `EnumFacing rotate(EnumFacing facing)`
- `int rotate(EnumFacing facing, int vertexIndex)`
- `EnumFacing rotateFace(EnumFacing facing)`
- `int rotateVertex(EnumFacing facing, int vertexIndex)`
- `static ModelRotation valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static ModelRotation [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.