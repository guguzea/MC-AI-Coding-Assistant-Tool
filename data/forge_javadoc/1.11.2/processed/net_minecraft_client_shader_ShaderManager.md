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