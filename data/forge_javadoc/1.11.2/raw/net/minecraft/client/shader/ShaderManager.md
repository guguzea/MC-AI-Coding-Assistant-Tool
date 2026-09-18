---
title: "ShaderManager"
description: "public class ShaderManager extends java.lang.Object"
package: "net/minecraft/client/shader"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/shader/ShaderManager.html"
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
- `@Nullable public ShaderUniform getShaderUniform(java.lang.String name)`
- `public ShaderUniform getShaderUniformOrDefault(java.lang.String name)`
- `public void addSamplerTexture(java.lang.String name, java.lang.Object samplerTexture)`
- `public ShaderLoader getVertexShaderLoader()`
- `public ShaderLoader getFragmentShaderLoader()`
- `public int getProgram()`
