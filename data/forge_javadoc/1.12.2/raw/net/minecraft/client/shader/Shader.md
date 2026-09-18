---
title: "Shader"
description: "public class Shader extends java.lang.Object"
package: "net/minecraft/client/shader"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/shader/Shader.html"
sourceType: javadoc
---

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
- `public void setProjectionMatrix(Matrix4f projectionMatrixIn)`
- `public void render(float partialTicks)`
- `public ShaderManager getShaderManager()`
