---
title: "Framebuffer"
description: "public class Framebuffer extends java.lang.Object"
package: "net/minecraft/client/shader"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/shader/Framebuffer.html"
sourceType: javadoc
---

# Framebuffer

**Inheritance:** java.lang.Object → net.minecraft.client.shader.Framebuffer

## Class signature

```java
public class Framebuffer extends java.lang.Object
```

## Constructors

- `Framebuffer(int width, int height, boolean useDepthIn)`

## Methods

- `void bindFramebuffer(boolean p_147610_1_)`
- `void bindFramebufferTexture()`
- `void checkFramebufferComplete()`
- `void createBindFramebuffer(int width, int height)`
- `void createFramebuffer(int width, int height)`
- `void deleteFramebuffer()`
- `boolean enableStencil()` — Attempts to enabled 8 bits of stencil buffer on this FrameBuffer.
- `void framebufferClear()`
- `void framebufferRender(int width, int height)`
- `void framebufferRenderExt(int width, int height, boolean p_178038_3_)`
- `boolean isStencilEnabled()` — Returns wither or not this FBO has been successfully initialized with stencil bits.
- `void setFramebufferColor(float red, float green, float blue, float alpha)`
- `void setFramebufferFilter(int framebufferFilterIn)`
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
