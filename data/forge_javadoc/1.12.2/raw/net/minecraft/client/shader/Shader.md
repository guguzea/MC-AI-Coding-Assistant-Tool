---
title: "Shader"
description: "public class Shader extends java.lang.Object"
package: "net/minecraft/client/shader"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/shader/Shader.html"
sourceType: javadoc
---

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
- `void render(float partialTicks)`
- `void setProjectionMatrix(Matrix4f projectionMatrixIn)`

## Fields

- `Framebuffer framebufferIn`
- `Framebuffer framebufferOut`
