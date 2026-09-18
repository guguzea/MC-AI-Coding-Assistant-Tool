# OpenGlHelper

## Class signature

```java
public class OpenGlHelper extends java.lang.Object
```

## Constructors

- `public OpenGlHelper()`

## Methods

- `public static void initializeTextures()`
- `public static boolean areShadersSupported()`
- `public static java.lang.String getLogText()`
- `public static int glGetProgrami(int program, int pname)`
- `public static void glAttachShader(int program, int shaderIn)`
- `public static void glDeleteShader(int p_153180_0_)`
- `public static int glCreateShader(int type)`
- `public static void glShaderSource(int shaderIn, java.nio.ByteBuffer string)`
- `public static void glCompileShader(int shaderIn)`
- `public static int glGetShaderi(int shaderIn, int pname)`
- `public static java.lang.String glGetShaderInfoLog(int shaderIn, int maxLength)`
- `public static java.lang.String glGetProgramInfoLog(int program, int maxLength)`
- `public static void glUseProgram(int program)`
- `public static int glCreateProgram()`
- `public static void glDeleteProgram(int program)`
- `public static void glLinkProgram(int program)`
- `public static int glGetUniformLocation(int programObj, java.lang.CharSequence name)`
- `public static void glUniform1(int location, java.nio.IntBuffer values)`
- `public static void glUniform1i(int location, int v0)`
- `public static void glUniform1(int location, java.nio.FloatBuffer values)`
- `public static void glUniform2(int location, java.nio.IntBuffer values)`
- `public static void glUniform2(int location, java.nio.FloatBuffer values)`
- `public static void glUniform3(int location, java.nio.IntBuffer values)`
- `public static void glUniform3(int location, java.nio.FloatBuffer values)`
- `public static void glUniform4(int location, java.nio.IntBuffer values)`
- `public static void glUniform4(int location, java.nio.FloatBuffer values)`
- `public static void glUniformMatrix2(int location, boolean transpose, java.nio.FloatBuffer matrices)`
- `public static void glUniformMatrix3(int location, boolean transpose, java.nio.FloatBuffer matrices)`
- `public static void glUniformMatrix4(int location, boolean transpose, java.nio.FloatBuffer matrices)`
- `public static int glGetAttribLocation(int p_153164_0_, java.lang.CharSequence p_153164_1_)`
- `public static int glGenBuffers()`
- `public static void glBindBuffer(int target, int buffer)`
- `public static void glBufferData(int target, java.nio.ByteBuffer data, int usage)`
- `public static void glDeleteBuffers(int buffer)`
- `public static boolean useVbo()`
- `public static void glBindFramebuffer(int target, int framebufferIn)`
- `public static void glBindRenderbuffer(int target, int renderbuffer)`
- `public static void glDeleteRenderbuffers(int renderbuffer)`
- `public static void glDeleteFramebuffers(int framebufferIn)`
- `public static int glGenFramebuffers()`
- `public static int glGenRenderbuffers()`
- `public static void glRenderbufferStorage(int target, int internalFormat, int width, int height)`
- `public static void glFramebufferRenderbuffer(int target, int attachment, int renderBufferTarget, int renderBuffer)`
- `public static int glCheckFramebufferStatus(int target)`
- `public static void glFramebufferTexture2D(int target, int attachment, int textarget, int texture, int level)`
- `public static void setActiveTexture(int texture)`
- `public static void setClientActiveTexture(int texture)`
- `public static void setLightmapTextureCoords(int target, float p_77475_1_, float p_77475_2_)`
- `public static void glBlendFunc(int sFactorRGB, int dFactorRGB, int sfactorAlpha, int dfactorAlpha)`
- `public static boolean isFramebufferEnabled()`
- `public static java.lang.String getCpu()`

## Description

An OpenGL constant corresponding to GL_TEXTURE0, used when setting data pertaining to auxiliary OpenGL texture units.