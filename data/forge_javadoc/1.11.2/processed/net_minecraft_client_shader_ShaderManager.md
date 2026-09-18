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