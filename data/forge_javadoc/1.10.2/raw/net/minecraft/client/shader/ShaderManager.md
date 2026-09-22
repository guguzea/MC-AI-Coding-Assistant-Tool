---
title: "ShaderManager"
description: "public class ShaderManager extends java.lang.Object"
package: "net/minecraft/client/shader"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/shader/ShaderManager.html"
sourceType: javadoc
---

# ShaderManager

**Inheritance:** java.lang.Object → net.minecraft.client.shader.ShaderManager

## Class signature

```java
public class ShaderManager extends java.lang.Object
```

## Constructors

- `ShaderManager(IResourceManager resourceManager, java.lang.String programName)`

## Methods

- `void addSamplerTexture(java.lang.String name, java.lang.Object samplerTexture)`
- `void deleteShader()`
- `void endShader()`
- `ShaderLoader getFragmentShaderLoader()`
- `int getProgram()`
- `ShaderUniform getShaderUniform(java.lang.String name)`
- `ShaderUniform getShaderUniformOrDefault(java.lang.String name)`
- `ShaderLoader getVertexShaderLoader()`
- `void markDirty()`
- `void useShader()`
