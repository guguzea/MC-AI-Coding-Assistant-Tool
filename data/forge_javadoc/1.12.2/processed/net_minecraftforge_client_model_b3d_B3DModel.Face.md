# B3DModel.Face

## Constructors

- `public Face( B3DModel.Vertex v1, B3DModel.Vertex v2, B3DModel.Vertex v3, B3DModel.Brush brush)`
- `public Face( B3DModel.Vertex v1, B3DModel.Vertex v2, B3DModel.Vertex v3, B3DModel.Brush brush, Vector3f normal)`

## Methods

- `public B3DModel.Vertex getV1()`
- `public B3DModel.Vertex getV2()`
- `public B3DModel.Vertex getV3()`
- `public B3DModel.Brush getBrush()`
- `public java.lang.String toString()`
- `public Vector3f getNormal()`
- `public static Vector3f getNormal( B3DModel.Vertex v1, B3DModel.Vertex v2, B3DModel.Vertex v3)`