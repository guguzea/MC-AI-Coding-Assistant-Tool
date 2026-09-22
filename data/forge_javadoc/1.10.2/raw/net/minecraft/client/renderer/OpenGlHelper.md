---
title: "OpenGlHelper"
description: "public class OpenGlHelper extends java.lang.Object"
package: "net/minecraft/client/renderer"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/renderer/OpenGlHelper.html"
sourceType: javadoc
---

# OpenGlHelper

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.OpenGlHelper

## Class signature

```java
public class OpenGlHelper extends java.lang.Object
```

## Constructors

- `OpenGlHelper()`

## Methods

- `static boolean areShadersSupported()`
- `static java.lang.String getCpu()`
- `static java.lang.String getLogText()`
- `static void glAttachShader(int program, int shaderIn)`
- `static void glBindBuffer(int target, int buffer)`
- `static void glBindFramebuffer(int target, int framebufferIn)`
- `static void glBindRenderbuffer(int target, int renderbuffer)`
- `static void glBlendFunc(int sFactorRGB, int dFactorRGB, int sfactorAlpha, int dfactorAlpha)`
- `static void glBufferData(int target, java.nio.ByteBuffer data, int usage)`
- `static int glCheckFramebufferStatus(int target)`
- `static void glCompileShader(int shaderIn)`
- `static int glCreateProgram()`
- `static int glCreateShader(int type)`
- `static void glDeleteBuffers(int buffer)`
- `static void glDeleteFramebuffers(int framebufferIn)`
- `static void glDeleteProgram(int program)`
- `static void glDeleteRenderbuffers(int renderbuffer)`
- `static void glDeleteShader(int shaderIn)`
- `static void glFramebufferRenderbuffer(int target, int attachment, int renderBufferTarget, int renderBuffer)`
- `static void glFramebufferTexture2D(int target, int attachment, int textarget, int texture, int level)`
- `static int glGenBuffers()`
- `static int glGenFramebuffers()`
- `static int glGenRenderbuffers()`
- `static int glGetAttribLocation(int program, java.lang.CharSequence name)`
- `static int glGetProgrami(int program, int pname)`
- `static java.lang.String glGetProgramInfoLog(int program, int maxLength)`
- `static int glGetShaderi(int shaderIn, int pname)`
- `static java.lang.String glGetShaderInfoLog(int shaderIn, int maxLength)`
- `static int glGetUniformLocation(int programObj, java.lang.CharSequence name)`
- `static void glLinkProgram(int program)`
- `static void glRenderbufferStorage(int target, int internalFormat, int width, int height)`
- `static void glShaderSource(int shaderIn, java.nio.ByteBuffer string)`
- `static void glUniform1(int location, java.nio.FloatBuffer values)`
- `static void glUniform1(int location, java.nio.IntBuffer values)`
- `static void glUniform1i(int location, int v0)`
- `static void glUniform2(int location, java.nio.FloatBuffer values)`
- `static void glUniform2(int location, java.nio.IntBuffer values)`
- `static void glUniform3(int location, java.nio.FloatBuffer values)`
- `static void glUniform3(int location, java.nio.IntBuffer values)`
- `static void glUniform4(int location, java.nio.FloatBuffer values)`
- `static void glUniform4(int location, java.nio.IntBuffer values)`
- `static void glUniformMatrix2(int location, boolean transpose, java.nio.FloatBuffer matrices)`
- `static void glUniformMatrix3(int location, boolean transpose, java.nio.FloatBuffer matrices)`
- `static void glUniformMatrix4(int location, boolean transpose, java.nio.FloatBuffer matrices)`
- `static void glUseProgram(int program)`
- `static void initializeTextures()`
- `static boolean isFramebufferEnabled()`
- `static void openFile(java.io.File fileIn)`
- `static void renderDirections(int p_188785_0_)`
- `static void setActiveTexture(int texture)`
- `static void setClientActiveTexture(int texture)`
- `static void setLightmapTextureCoords(int target, float p_77475_1_, float t)`
- `static boolean useVbo()`

## Fields

- `static boolean ati`
- `static int defaultTexUnit`
- `static boolean extBlendFuncSeparate`
- `static boolean framebufferSupported`
- `static int GL_ARRAY_BUFFER`
- `static int GL_COLOR_ATTACHMENT0`
- `static int GL_COMBINE`
- `static int GL_COMBINE_ALPHA`
- `static int GL_COMBINE_RGB`
- `static int GL_COMPILE_STATUS`
- `static int GL_CONSTANT`
- `static int GL_DEPTH_ATTACHMENT`
- `static int GL_FB_INCOMPLETE_ATTACHMENT`
- `static int GL_FB_INCOMPLETE_DRAW_BUFFER`
- `static int GL_FB_INCOMPLETE_MISS_ATTACH`
- `static int GL_FB_INCOMPLETE_READ_BUFFER`
- `static int GL_FRAGMENT_SHADER`
- `static int GL_FRAMEBUFFER`
- `static int GL_FRAMEBUFFER_COMPLETE`
- `static int GL_INTERPOLATE`
- `static int GL_LINK_STATUS`
- `static int GL_OPERAND0_ALPHA`
- `static int GL_OPERAND0_RGB`
- `static int GL_OPERAND1_ALPHA`
- `static int GL_OPERAND1_RGB`
- `static int GL_OPERAND2_ALPHA`
- `static int GL_OPERAND2_RGB`
- `static int GL_PREVIOUS`
- `static int GL_PRIMARY_COLOR`
- `static int GL_RENDERBUFFER`
- `static int GL_SOURCE0_ALPHA`
- `static int GL_SOURCE0_RGB`
- `static int GL_SOURCE1_ALPHA`
- `static int GL_SOURCE1_RGB`
- `static int GL_SOURCE2_ALPHA`
- `static int GL_SOURCE2_RGB`
- `static int GL_STATIC_DRAW`
- `static int GL_TEXTURE2`
- `static int GL_VERTEX_SHADER`
- `static float lastBrightnessX`
- `static float lastBrightnessY`
- `static int lightmapTexUnit`
- `static boolean nvidia`
- `static boolean openGL21`
- `static boolean shadersSupported`
- `static boolean vboSupported`
- `static boolean vboSupportedAti`
