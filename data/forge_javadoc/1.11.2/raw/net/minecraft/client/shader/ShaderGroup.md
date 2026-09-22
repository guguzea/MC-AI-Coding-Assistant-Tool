---
title: "ShaderGroup"
description: "public class ShaderGroup extends java.lang.Object"
package: "net/minecraft/client/shader"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/shader/ShaderGroup.html"
sourceType: javadoc
---

# ShaderGroup

**Inheritance:** java.lang.Object → net.minecraft.client.shader.ShaderGroup

## Class signature

```java
public class ShaderGroup extends java.lang.Object
```

## Constructors

- `ShaderGroup(TextureManager p_i1050_1_, IResourceManager resourceManagerIn, Framebuffer mainFramebufferIn, ResourceLocation p_i1050_4_)`

## Methods

- `void addFramebuffer(java.lang.String p_148020_1_, int p_148020_2_, int p_148020_3_)`
- `Shader addShader(java.lang.String programName, Framebuffer framebufferIn, Framebuffer framebufferOut)`
- `void createBindFramebuffers(int width, int height)`
- `void deleteShaderGroup()`
- `Framebuffer getFramebufferRaw(java.lang.String attributeName)`
- `java.lang.String getShaderGroupName()`
- `void loadShaderGroup(float partialTicks)`
- `void parseGroup(TextureManager p_152765_1_, ResourceLocation p_152765_2_)`
