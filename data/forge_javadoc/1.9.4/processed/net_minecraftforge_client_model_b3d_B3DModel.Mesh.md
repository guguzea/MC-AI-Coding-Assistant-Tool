# B3DModel.Mesh

## Constructors

- `public Mesh(org.apache.commons.lang3.tuple.Pair< B3DModel.Brush ,java.util.List< B3DModel.Face >> data)`

## Methods

- `public com.google.common.collect.ImmutableMultimap< B3DModel.Vertex ,org.apache.commons.lang3.tuple.Pair<java.lang.Float, B3DModel.Node < B3DModel.Bone >>> getWeightMap()`
- `public com.google.common.collect.ImmutableList< B3DModel.Face > bake(com.google.common.base.Function< B3DModel.Node <?>,javax.vecmath.Matrix4f> animator)`
- `public B3DModel.Brush getBrush()`
- `public com.google.common.collect.ImmutableList< B3DModel.Face > getFaces()`
- `public com.google.common.collect.ImmutableSet< B3DModel.Node < B3DModel.Bone >> getBones()`
- `public java.lang.String toString()`
- `public void setParent( B3DModel.Node < B3DModel.Mesh > parent)`
- `public B3DModel.Node < B3DModel.Mesh > getParent()`