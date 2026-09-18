---
title: "ShaderManager"
description: "adds a shader sampler texture. if it already exists, replaces it."
package: "net/minecraft/client/shader"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/shader/ShaderManager.html"
sourceType: javadoc
---

# ShaderManager

## Class signature

```java
public class ShaderManager extends java.lang.Object
```

## Constructors

- `public ShaderManager( IResourceManager resourceManager, java.lang.String programName) throws JsonException , java.io.IOException`

## Methods

- `public void deleteShader()`
- `public void endShader()`
- `public void useShader()`
- `public void markDirty()`
- `public ShaderUniform getShaderUniform(java.lang.String p_147991_1_)`
- `public ShaderUniform getShaderUniformOrDefault(java.lang.String p_147984_1_)`
- `public void addSamplerTexture(java.lang.String p_147992_1_, java.lang.Object p_147992_2_)`
- `public ShaderLoader getVertexShaderLoader()`
- `public ShaderLoader getFragmentShaderLoader()`
- `public int getProgram()`

## Description

adds a shader sampler texture. if it already exists, replaces it.
