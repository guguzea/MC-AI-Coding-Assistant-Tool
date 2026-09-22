# Shader

**Inheritance:** java.lang.Object → net.minecraft.client.shader.Shader

## Class signature

```java
public class Shader extends java.lang.Object
```

## Constructors

- `Shader(IResourceManager resourceManager, java.lang.String programName, Framebuffer framebufferInIn, Framebuffer framebufferOutIn)`

## Methods

- `void addAuxFramebuffer(java.lang.String auxName, java.lang.Object auxFramebufferIn, int width, int height)`
- `void deleteShader()`
- `ShaderManager getShaderManager()`
- `void loadShader(float p_148042_1_)`
- `void setProjectionMatrix(org.lwjgl.util.vector.Matrix4f projectionMatrixIn)`

## Fields

- `Framebuffer framebufferIn`
- `Framebuffer framebufferOut`