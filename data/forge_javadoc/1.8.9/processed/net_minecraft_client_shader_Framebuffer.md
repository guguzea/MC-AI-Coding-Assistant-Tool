# Framebuffer

## Class signature

```java
public class Framebuffer extends java.lang.Object
```

## Constructors

- `public Framebuffer(int p_i45078_1_, int p_i45078_2_, boolean p_i45078_3_)`

## Methods

- `public void createBindFramebuffer(int width, int height)`
- `public void deleteFramebuffer()`
- `public void createFramebuffer(int width, int height)`
- `public void setFramebufferFilter(int p_147607_1_)`
- `public void checkFramebufferComplete()`
- `public void bindFramebufferTexture()`
- `public void unbindFramebufferTexture()`
- `public void bindFramebuffer(boolean p_147610_1_)`
- `public void unbindFramebuffer()`
- `public void setFramebufferColor(float p_147604_1_, float p_147604_2_, float p_147604_3_, float p_147604_4_)`
- `public void framebufferRender(int p_147615_1_, int p_147615_2_)`
- `public void framebufferRenderExt(int p_178038_1_, int p_178038_2_, boolean p_178038_3_)`
- `public void framebufferClear()`
- `public boolean enableStencil()`
- `public boolean isStencilEnabled()`

## Description

Attempts to enabled 8 bits of stencil buffer on this FrameBuffer.