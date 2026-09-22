---
title: "ShaderManager"
description: "public class ShaderManager extends java.lang.Object"
package: "net/minecraft/client/shader"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/shader/ShaderManager.html"
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

- `void addSamplerTexture(java.lang.String p_147992_1_, java.lang.Object p_147992_2_)` — adds a shader sampler texture. if it already exists, replaces it.
- `void deleteShader()`
- `void endShader()`
- `ShaderLoader getFragmentShaderLoader()`
- `int getProgram()`
- `ShaderUniform getShaderUniform(java.lang.String p_147991_1_)` — gets a shader uniform for the name given. null if not found.
- `ShaderUniform getShaderUniformOrDefault(java.lang.String p_147984_1_)` — gets a shader uniform for the name given. if not found, returns a default not-null value
- `ShaderLoader getVertexShaderLoader()`
- `void markDirty()`
- `void useShader()`
