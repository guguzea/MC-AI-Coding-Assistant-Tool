# B3DModel.Vertex

## Constructors

- `public Vertex(Vector3f pos, Vector3f normal, Vector4f color, Vector4f[] texCoords)`

## Methods

- `public B3DModel.Vertex bake( B3DModel.Mesh mesh, java.util.function.Function< B3DModel.Node <?>,Matrix4f> animator)`
- `public Vector3f getPos()`
- `public Vector3f getNormal()`
- `public Vector4f getColor()`
- `public Vector4f[] getTexCoords()`
- `public java.lang.String toString()`