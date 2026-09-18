---
title: "ShaderGroup"
description: "public class ShaderGroup extends java.lang.Object"
package: "net/minecraft/client/shader"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/shader/ShaderGroup.html"
sourceType: javadoc
---

# ShaderGroup

## Class signature

```java
public class ShaderGroup extends java.lang.Object
```

## Constructors

- `public ShaderGroup( TextureManager p_i1050_1_, IResourceManager resourceManagerIn, Framebuffer mainFramebufferIn, ResourceLocation p_i1050_4_) throws JsonException , java.io.IOException, com.google.gson.JsonSyntaxException`

## Methods

- `public void parseGroup( TextureManager p_152765_1_, ResourceLocation p_152765_2_) throws JsonException , java.io.IOException, com.google.gson.JsonSyntaxException`
- `public Framebuffer getFramebufferRaw(java.lang.String p_177066_1_)`
- `public void addFramebuffer(java.lang.String p_148020_1_, int p_148020_2_, int p_148020_3_)`
- `public void deleteShaderGroup()`
- `public Shader addShader(java.lang.String p_148023_1_, Framebuffer p_148023_2_, Framebuffer p_148023_3_) throws JsonException , java.io.IOException`
- `public void createBindFramebuffers(int width, int height)`
- `public void loadShaderGroup(float partialTicks)`
- `public final java.lang.String getShaderGroupName()`
