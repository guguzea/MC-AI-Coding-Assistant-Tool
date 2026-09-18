# B3DModel.Node

## Constructors

- `public Node(java.lang.String name, Vector3f pos, Vector3f scale, Quat4f rot, java.util.List< B3DModel.Node <?>> nodes, K kind)`

## Methods

- `public static <K extends B3DModel.IKind <K>> B3DModel.Node <K> create(java.lang.String name, Vector3f pos, Vector3f scale, Quat4f rot, java.util.List< B3DModel.Node <?>> nodes, K kind)`
- `public void setAnimation( B3DModel.Animation animation)`
- `public void setAnimation(<any> animData, <any> keyData)`
- `public java.lang.String getName()`
- `public K getKind()`
- `public Vector3f getPos()`
- `public Vector3f getScale()`
- `public Quat4f getRot()`
- `public <any> getNodes()`
- `public B3DModel.Animation getAnimation()`
- `public B3DModel.Node <? extends B3DModel.IKind <?>> getParent()`
- `public void setParent( B3DModel.Node <? extends B3DModel.IKind <?>> parent)`
- `public java.lang.String toString()`