---
title: "Framebuffer"
description: "Attempts to enabled 8 bits of stencil buffer on this FrameBuffer."
package: "net/minecraft/client/shader"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/shader/Framebuffer.html"
sourceType: javadoc
---

# Framebuffer

## Class signature

```java
public class Framebuffer extends java.lang.Object
```

## Constructors

- `public Framebuffer(int width, int height, boolean useDepthIn)`

## Methods

- `public void createBindFramebuffer(int width, int height)`
- `public void deleteFramebuffer()`
- `public void createFramebuffer(int width, int height)`
- `public void setFramebufferFilter(int framebufferFilterIn)`
- `public void checkFramebufferComplete()`
- `public void bindFramebufferTexture()`
- `public void unbindFramebufferTexture()`
- `public void bindFramebuffer(boolean p_147610_1_)`
- `public void unbindFramebuffer()`
- `public void setFramebufferColor(float red, float green, float blue, float alpha)`
- `public void framebufferRender(int width, int height)`
- `public void framebufferRenderExt(int width, int height, boolean p_178038_3_)`
- `public void framebufferClear()`
- `public boolean enableStencil()`
- `public boolean isStencilEnabled()`

## Description

Attempts to enabled 8 bits of stencil buffer on this FrameBuffer.
