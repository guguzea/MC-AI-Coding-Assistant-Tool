# B3DLoader.B3DState

## Constructors

- `public B3DState( B3DModel.Animation animation, int frame)`
- `public B3DState( B3DModel.Animation animation, int frame, IModelState parent)`
- `public B3DState( B3DModel.Animation animation, int frame, int nextFrame, float progress)`
- `public B3DState( B3DModel.Animation animation, int frame, int nextFrame, float progress, IModelState parent)`

## Methods

- `public B3DModel.Animation getAnimation()`
- `public int getFrame()`
- `public int getNextFrame()`
- `public float getProgress()`
- `public IModelState getParent()`
- `public com.google.common.base.Optional< TRSRTransformation > apply(com.google.common.base.Optional<? extends IModelPart > part)`
- `public TRSRTransformation getNodeMatrix( B3DModel.Node <?> node)`
- `public TRSRTransformation getNodeMatrix( B3DModel.Node <?> node, int frame)`
- `public static TRSRTransformation getNodeMatrix( B3DModel.Animation animation, B3DModel.Node <?> node, int frame)`