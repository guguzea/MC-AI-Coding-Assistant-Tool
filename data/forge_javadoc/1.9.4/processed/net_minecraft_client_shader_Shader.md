# Shader

## Class signature

```java
public class Shader extends java.lang.Object
```

## Constructors

- `public Shader( IResourceManager resourceManager, java.lang.String programName, Framebuffer framebufferInIn, Framebuffer framebufferOutIn) throws JsonException , java.io.IOException`

## Methods

- `public void deleteShader()`
- `public void addAuxFramebuffer(java.lang.String auxName, java.lang.Object auxFramebufferIn, int width, int height)`
- `public void setProjectionMatrix(org.lwjgl.util.vector.Matrix4f projectionMatrixIn)`
- `public void loadShader(float p_148042_1_)`
- `public ShaderManager getShaderManager()`