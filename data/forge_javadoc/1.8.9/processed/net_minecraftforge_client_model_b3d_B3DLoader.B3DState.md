# B3DLoader.B3DState

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.b3d.B3DLoader.B3DState

## Class signature

```java
public static class B3DLoader.B3DState extends java.lang.Object implements IModelState
```

## Constructors

- `B3DState(B3DModel.Animation animation, int frame)`
- `B3DState(B3DModel.Animation animation, int frame, IModelState parent)`
- `B3DState(B3DModel.Animation animation, int frame, int nextFrame, float progress)`
- `B3DState(B3DModel.Animation animation, int frame, int nextFrame, float progress, IModelState parent)`

## Methods

- `<any> apply(<any> part)`
- `B3DModel.Animation getAnimation()`
- `int getFrame()`
- `int getNextFrame()`
- `static TRSRTransformation getNodeMatrix(B3DModel.Animation animation, B3DModel.Node<?> node, int frame)`
- `TRSRTransformation getNodeMatrix(B3DModel.Node<?> node)`
- `TRSRTransformation getNodeMatrix(B3DModel.Node<?> node, int frame)`
- `IModelState getParent()`
- `float getProgress()`