# ShaderGroup

**Inheritance:** java.lang.Object → net.minecraft.client.shader.ShaderGroup

## Class signature

```java
public class ShaderGroup extends java.lang.Object
```

## Constructors

- `ShaderGroup(TextureManager p_i1050_1_, IResourceManager resourceManagerIn, Framebuffer mainFramebufferIn, ResourceLocation p_i1050_4_)`

## Methods

- `void addFramebuffer(java.lang.String name, int width, int height)`
- `Shader addShader(java.lang.String programName, Framebuffer framebufferIn, Framebuffer framebufferOut)`
- `void createBindFramebuffers(int width, int height)`
- `void deleteShaderGroup()`
- `Framebuffer getFramebufferRaw(java.lang.String attributeName)`
- `java.lang.String getShaderGroupName()`
- `void parseGroup(TextureManager p_152765_1_, ResourceLocation p_152765_2_)`
- `void render(float partialTicks)`