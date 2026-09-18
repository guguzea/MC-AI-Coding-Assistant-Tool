---
title: "OpenGlHelper"
description: "public class OpenGlHelper extends java.lang.Object"
package: "net/minecraft/client/renderer"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/renderer/OpenGlHelper.html"
sourceType: javadoc
---

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
- `public static void glDeleteShader(int shaderIn)`
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
- `public static int glGetAttribLocation(int program, java.lang.CharSequence name)`
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
- `public static void setLightmapTextureCoords(int target, float p_77475_1_, float t)`
- `public static void glBlendFunc(int sFactorRGB, int dFactorRGB, int sfactorAlpha, int dfactorAlpha)`
- `public static boolean isFramebufferEnabled()`
- `public static java.lang.String getCpu()`
- `public static void renderDirections(int p_188785_0_)`
- `public static void openFile(java.io.File fileIn)`
