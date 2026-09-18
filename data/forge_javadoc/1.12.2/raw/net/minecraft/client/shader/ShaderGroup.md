---
title: "ShaderGroup"
description: "public class ShaderGroup extends java.lang.Object"
package: "net/minecraft/client/shader"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/shader/ShaderGroup.html"
sourceType: javadoc
---

# ShaderGroup

## Class signature

```java
public class ShaderGroup extends java.lang.Object
```

## Constructors

- `public ShaderGroup( TextureManager p_i1050_1_, IResourceManager resourceManagerIn, Framebuffer mainFramebufferIn, ResourceLocation p_i1050_4_) throws JsonException , java.io.IOException, JsonSyntaxException`

## Methods

- `public void parseGroup( TextureManager p_152765_1_, ResourceLocation p_152765_2_) throws JsonException , java.io.IOException, JsonSyntaxException`
- `public Framebuffer getFramebufferRaw(java.lang.String attributeName)`
- `public void addFramebuffer(java.lang.String name, int width, int height)`
- `public void deleteShaderGroup()`
- `public Shader addShader(java.lang.String programName, Framebuffer framebufferIn, Framebuffer framebufferOut) throws JsonException , java.io.IOException`
- `public void createBindFramebuffers(int width, int height)`
- `public void render(float partialTicks)`
- `public final java.lang.String getShaderGroupName()`
