---
title: "GlStateManager"
description: "public class GlStateManager extends java.lang.Object"
package: "net/minecraft/client/renderer"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/renderer/GlStateManager.html"
sourceType: javadoc
---

# GlStateManager

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.GlStateManager

## Class signature

```java
public class GlStateManager extends java.lang.Object
```

## Constructors

- `GlStateManager()`

## Methods

- `static void alphaFunc(int func, float ref)`
- `static void bindTexture(int texture)`
- `static void blendFunc(GlStateManager.SourceFactor srcFactor, GlStateManager.DestFactor dstFactor)`
- `static void blendFunc(int srcFactor, int dstFactor)`
- `static void callList(int list)`
- `static void clear(int mask)`
- `static void clearColor(float red, float green, float blue, float alpha)`
- `static void clearDepth(double depth)`
- `static void color(float colorRed, float colorGreen, float colorBlue)`
- `static void color(float colorRed, float colorGreen, float colorBlue, float colorAlpha)`
- `static void colorLogicOp(GlStateManager.LogicOp logicOperation)`
- `static void colorLogicOp(int opcode)`
- `static void colorMask(boolean red, boolean green, boolean blue, boolean alpha)`
- `static void colorMaterial(int face, int mode)`
- `static void cullFace(GlStateManager.CullFace cullFace)`
- `static void deleteTexture(int texture)`
- `static void depthFunc(int depthFunc)`
- `static void depthMask(boolean flagIn)`
- `static void disableAlpha()`
- `static void disableBlend()`
- `static void disableBlendProfile(GlStateManager.Profile p_187440_0_)`
- `static void disableColorLogic()`
- `static void disableColorMaterial()`
- `static void disableCull()`
- `static void disableDepth()`
- `static void disableFog()`
- `static void disableLight(int light)`
- `static void disableLighting()`
- `static void disableNormalize()`
- `static void disableOutlineMode()`
- `static void disablePolygonOffset()`
- `static void disableRescaleNormal()`
- `static void disableTexGenCoord(GlStateManager.TexGen texGen)`
- `static void disableTexture2D()`
- `static void doPolygonOffset(float factor, float units)`
- `static void enableAlpha()`
- `static void enableBlend()`
- `static void enableBlendProfile(GlStateManager.Profile p_187408_0_)`
- `static void enableColorLogic()`
- `static void enableColorMaterial()`
- `static void enableCull()`
- `static void enableDepth()`
- `static void enableFog()`
- `static void enableLight(int light)`
- `static void enableLighting()`
- `static void enableNormalize()`
- `static void enableOutlineMode(int color)`
- `static void enablePolygonOffset()`
- `static void enableRescaleNormal()`
- `static void enableTexGenCoord(GlStateManager.TexGen texGen)`
- `static void enableTexture2D()`
- `static int generateTexture()`
- `static void getFloat(int pname, java.nio.FloatBuffer params)`
- `static void glBegin(int mode)`
- `static void glBlendEquation(int blendEquation)`
- `static void glColorPointer(int size, int type, int stride, java.nio.ByteBuffer buffer)`
- `static void glColorPointer(int size, int type, int stride, int buffer_offset)`
- `static void glCopyTexSubImage2D(int target, int level, int xOffset, int yOffset, int x, int y, int width, int height)`
- `static void glDeleteLists(int list, int range)`
- `static void glDisableClientState(int cap)`
- `static void glDrawArrays(int mode, int first, int count)`
- `static void glEnableClientState(int cap)`
- `static void glEnd()`
- `static void glEndList()`
- `static void glFog(int pname, java.nio.FloatBuffer param)`
- `static void glFogi(int pname, int param)`
- `static int glGenLists(int range)`
- `static int glGetError()`
- `static int glGetInteger(int parameterName)`
- `static void glGetInteger(int parameterName, java.nio.IntBuffer parameters)`
- `static java.lang.String glGetString(int name)`
- `static void glGetTexImage(int target, int level, int format, int type, java.nio.IntBuffer pixels)`
- `static int glGetTexLevelParameteri(int target, int level, int parameterName)`
- `static void glLight(int light, int pname, java.nio.FloatBuffer params)`
- `static void glLightModel(int pname, java.nio.FloatBuffer params)`
- `static void glLineWidth(float width)`
- `static void glNewList(int list, int mode)`
- `static void glNormal3f(float nx, float ny, float nz)`
- `static void glNormalPointer(int type, int stride, java.nio.ByteBuffer buffer)`
- `static void glPixelStorei(int parameterName, int param)`
- `static void glPolygonMode(int face, int mode)`
- `static void glReadPixels(int x, int y, int width, int height, int format, int type, java.nio.IntBuffer pixels)`
- `static void glTexCoord2f(float sCoord, float tCoord)`
- `static void glTexCoordPointer(int size, int type, int stride, java.nio.ByteBuffer buffer)`
- `static void glTexCoordPointer(int size, int type, int stride, int buffer_offset)`
- `static void glTexEnv(int target, int parameterName, java.nio.FloatBuffer parameters)`
- `static void glTexEnvf(int target, int parameterName, float parameter)`
- `static void glTexEnvi(int target, int parameterName, int parameter)`
- `static void glTexImage2D(int target, int level, int internalFormat, int width, int height, int border, int format, int type, java.nio.IntBuffer pixels)`
- `static void glTexParameterf(int target, int parameterName, float parameter)`
- `static void glTexParameteri(int target, int parameterName, int parameter)`
- `static void glTexSubImage2D(int target, int level, int xOffset, int yOffset, int width, int height, int format, int type, java.nio.IntBuffer pixels)`
- `static void glVertex3f(float x, float y, float z)`
- `static void glVertexPointer(int size, int type, int stride, java.nio.ByteBuffer buffer)`
- `static void glVertexPointer(int size, int type, int stride, int buffer_offset)`
- `static void loadIdentity()`
- `static void matrixMode(int mode)`
- `static void multMatrix(java.nio.FloatBuffer matrix)`
- `static void ortho(double left, double right, double bottom, double top, double zNear, double zFar)`
- `static void popAttrib()`
- `static void popMatrix()`
- `static void pushAttrib()`
- `static void pushMatrix()`
- `static java.nio.FloatBuffer quatToGlMatrix(java.nio.FloatBuffer buffer, Quaternion quaternionIn)`
- `static void resetColor()`
- `static void rotate(float angle, float x, float y, float z)`
- `static void rotate(Quaternion quaternionIn)`
- `static void scale(double x, double y, double z)`
- `static void scale(float x, float y, float z)`
- `static void setActiveTexture(int texture)`
- `static void setFog(GlStateManager.FogMode fogMode)`
- `static void setFogDensity(float param)`
- `static void setFogEnd(float param)`
- `static void setFogStart(float param)`
- `static void shadeModel(int mode)`
- `static void texGen(GlStateManager.TexGen texGen, int param)`
- `static void texGen(GlStateManager.TexGen texGen, int pname, java.nio.FloatBuffer params)`
- `static void translate(double x, double y, double z)`
- `static void translate(float x, float y, float z)`
- `static void tryBlendFuncSeparate(GlStateManager.SourceFactor srcFactor, GlStateManager.DestFactor dstFactor, GlStateManager.SourceFactor srcFactorAlpha, GlStateManager.DestFactor dstFactorAlpha)`
- `static void tryBlendFuncSeparate(int srcFactor, int dstFactor, int srcFactorAlpha, int dstFactorAlpha)`
- `static void viewport(int x, int y, int width, int height)`
