# Framebuffer

**Inheritance:** java.lang.Object → net.minecraft.client.shader.Framebuffer

## Class signature

```java
public class Framebuffer extends java.lang.Object
```

## Constructors

- `Framebuffer(int p_i45078_1_, int p_i45078_2_, boolean p_i45078_3_)`

## Methods

- `void bindFramebuffer(boolean p_147610_1_)`
- `void bindFramebufferTexture()`
- `void checkFramebufferComplete()`
- `void createBindFramebuffer(int width, int height)`
- `void createFramebuffer(int width, int height)`
- `void deleteFramebuffer()`
- `boolean enableStencil()` — Attempts to enabled 8 bits of stencil buffer on this FrameBuffer.
- `void framebufferClear()`
- `void framebufferRender(int p_147615_1_, int p_147615_2_)`
- `void framebufferRenderExt(int p_178038_1_, int p_178038_2_, boolean p_178038_3_)`
- `boolean isStencilEnabled()` — Returns wither or not this FBO has been successfully initialized with stencil bits.
- `void setFramebufferColor(float p_147604_1_, float p_147604_2_, float p_147604_3_, float p_147604_4_)`
- `void setFramebufferFilter(int p_147607_1_)`
- `void unbindFramebuffer()`
- `void unbindFramebufferTexture()`

## Fields

- `int depthBuffer`
- `float[] framebufferColor`
- `int framebufferFilter`
- `int framebufferHeight`
- `int framebufferObject`
- `int framebufferTexture`
- `int framebufferTextureHeight`
- `int framebufferTextureWidth`
- `int framebufferWidth`
- `boolean useDepth`