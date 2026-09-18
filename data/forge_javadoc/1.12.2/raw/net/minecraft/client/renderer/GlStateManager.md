---
title: "GlStateManager"
description: "public class GlStateManager extends java.lang.Object"
package: "net/minecraft/client/renderer"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/renderer/GlStateManager.html"
sourceType: javadoc
---

# GlStateManager

## Class signature

```java
public class GlStateManager extends java.lang.Object
```

## Constructors

- `public GlStateManager()`

## Methods

- `public static void pushAttrib()`
- `public static void popAttrib()`
- `public static void disableAlpha()`
- `public static void enableAlpha()`
- `public static void alphaFunc(int func, float ref)`
- `public static void enableLighting()`
- `public static void disableLighting()`
- `public static void enableLight(int light)`
- `public static void disableLight(int light)`
- `public static void enableColorMaterial()`
- `public static void disableColorMaterial()`
- `public static void colorMaterial(int face, int mode)`
- `public static void glLight(int light, int pname, java.nio.FloatBuffer params)`
- `public static void glLightModel(int pname, java.nio.FloatBuffer params)`
- `public static void glNormal3f(float nx, float ny, float nz)`
- `public static void disableDepth()`
- `public static void enableDepth()`
- `public static void depthFunc(int depthFunc)`
- `public static void depthMask(boolean flagIn)`
- `public static void disableBlend()`
- `public static void enableBlend()`
- `public static void blendFunc( GlStateManager.SourceFactor srcFactor, GlStateManager.DestFactor dstFactor)`
- `public static void blendFunc(int srcFactor, int dstFactor)`
- `public static void tryBlendFuncSeparate( GlStateManager.SourceFactor srcFactor, GlStateManager.DestFactor dstFactor, GlStateManager.SourceFactor srcFactorAlpha, GlStateManager.DestFactor dstFactorAlpha)`
- `public static void tryBlendFuncSeparate(int srcFactor, int dstFactor, int srcFactorAlpha, int dstFactorAlpha)`
- `public static void glBlendEquation(int blendEquation)`
- `public static void enableOutlineMode(int color)`
- `public static void disableOutlineMode()`
- `public static void enableFog()`
- `public static void disableFog()`
- `public static void setFog( GlStateManager.FogMode fogMode)`
- `public static void setFogDensity(float param)`
- `public static void setFogStart(float param)`
- `public static void setFogEnd(float param)`
- `public static void glFog(int pname, java.nio.FloatBuffer param)`
- `public static void glFogi(int pname, int param)`
- `public static void enableCull()`
- `public static void disableCull()`
- `public static void cullFace( GlStateManager.CullFace cullFace)`
- `public static void glPolygonMode(int face, int mode)`
- `public static void enablePolygonOffset()`
- `public static void disablePolygonOffset()`
- `public static void doPolygonOffset(float factor, float units)`
- `public static void enableColorLogic()`
- `public static void disableColorLogic()`
- `public static void colorLogicOp( GlStateManager.LogicOp logicOperation)`
- `public static void colorLogicOp(int opcode)`
- `public static void enableTexGenCoord( GlStateManager.TexGen texGen)`
- `public static void disableTexGenCoord( GlStateManager.TexGen texGen)`
- `public static void texGen( GlStateManager.TexGen texGen, int param)`
- `public static void texGen( GlStateManager.TexGen texGen, int pname, java.nio.FloatBuffer params)`
- `public static void setActiveTexture(int texture)`
- `public static void enableTexture2D()`
- `public static void disableTexture2D()`
- `public static void glTexEnv(int target, int parameterName, java.nio.FloatBuffer parameters)`
- `public static void glTexEnvi(int target, int parameterName, int parameter)`
- `public static void glTexEnvf(int target, int parameterName, float parameter)`
- `public static void glTexParameterf(int target, int parameterName, float parameter)`
- `public static void glTexParameteri(int target, int parameterName, int parameter)`
- `public static int glGetTexLevelParameteri(int target, int level, int parameterName)`
- `public static int generateTexture()`
- `public static void deleteTexture(int texture)`
- `public static void bindTexture(int texture)`
- `public static void glTexImage2D(int target, int level, int internalFormat, int width, int height, int border, int format, int type, java.nio.IntBuffer pixels)`
- `public static void glTexSubImage2D(int target, int level, int xOffset, int yOffset, int width, int height, int format, int type, java.nio.IntBuffer pixels)`
- `public static void glCopyTexSubImage2D(int target, int level, int xOffset, int yOffset, int x, int y, int width, int height)`
- `public static void glGetTexImage(int target, int level, int format, int type, java.nio.IntBuffer pixels)`
- `public static void enableNormalize()`
- `public static void disableNormalize()`
- `public static void shadeModel(int mode)`
- `public static void enableRescaleNormal()`
- `public static void disableRescaleNormal()`
- `public static void viewport(int x, int y, int width, int height)`
- `public static void colorMask(boolean red, boolean green, boolean blue, boolean alpha)`
- `public static void clearDepth(double depth)`
- `public static void clearColor(float red, float green, float blue, float alpha)`
- `public static void clear(int mask)`
- `public static void matrixMode(int mode)`
- `public static void loadIdentity()`
- `public static void pushMatrix()`
- `public static void popMatrix()`
- `public static void getFloat(int pname, java.nio.FloatBuffer params)`
- `public static void ortho(double left, double right, double bottom, double top, double zNear, double zFar)`
- `public static void rotate(float angle, float x, float y, float z)`
- `public static void scale(float x, float y, float z)`
- `public static void scale(double x, double y, double z)`
- `public static void translate(float x, float y, float z)`
- `public static void translate(double x, double y, double z)`
- `public static void multMatrix(java.nio.FloatBuffer matrix)`
- `public static void rotate(Quaternion quaternionIn)`
- `public static java.nio.FloatBuffer quatToGlMatrix(java.nio.FloatBuffer buffer, Quaternion quaternionIn)`
- `public static void color(float colorRed, float colorGreen, float colorBlue, float colorAlpha)`
- `public static void color(float colorRed, float colorGreen, float colorBlue)`
- `public static void glTexCoord2f(float sCoord, float tCoord)`
- `public static void glVertex3f(float x, float y, float z)`
- `public static void resetColor()`
- `public static void glNormalPointer(int type, int stride, java.nio.ByteBuffer buffer)`
- `public static void glTexCoordPointer(int size, int type, int stride, int buffer_offset)`
- `public static void glTexCoordPointer(int size, int type, int stride, java.nio.ByteBuffer buffer)`
- `public static void glVertexPointer(int size, int type, int stride, int buffer_offset)`
- `public static void glVertexPointer(int size, int type, int stride, java.nio.ByteBuffer buffer)`
- `public static void glColorPointer(int size, int type, int stride, int buffer_offset)`
- `public static void glColorPointer(int size, int type, int stride, java.nio.ByteBuffer buffer)`
- `public static void glDisableClientState(int cap)`
- `public static void glEnableClientState(int cap)`
- `public static void glBegin(int mode)`
- `public static void glEnd()`
- `public static void glDrawArrays(int mode, int first, int count)`
- `public static void glLineWidth(float width)`
- `public static void callList(int list)`
- `public static void glDeleteLists(int list, int range)`
- `public static void glNewList(int list, int mode)`
- `public static void glEndList()`
- `public static int glGenLists(int range)`
- `public static void glPixelStorei(int parameterName, int param)`
- `public static void glReadPixels(int x, int y, int width, int height, int format, int type, java.nio.IntBuffer pixels)`
- `public static int glGetError()`
- `public static java.lang.String glGetString(int name)`
- `public static void glGetInteger(int parameterName, java.nio.IntBuffer parameters)`
- `public static int glGetInteger(int parameterName)`
