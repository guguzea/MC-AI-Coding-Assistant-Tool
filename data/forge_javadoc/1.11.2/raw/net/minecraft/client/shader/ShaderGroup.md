---
title: "ShaderGroup"
description: "public class ShaderGroup extends java.lang.Object"
package: "net/minecraft/client/shader"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/shader/ShaderGroup.html"
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
- `public Framebuffer getFramebufferRaw(java.lang.String attributeName)`
- `public void addFramebuffer(java.lang.String p_148020_1_, int p_148020_2_, int p_148020_3_)`
- `public void deleteShaderGroup()`
- `public Shader addShader(java.lang.String programName, Framebuffer framebufferIn, Framebuffer framebufferOut) throws JsonException , java.io.IOException`
- `public void createBindFramebuffers(int width, int height)`
- `public void loadShaderGroup(float partialTicks)`
- `public final java.lang.String getShaderGroupName()`
