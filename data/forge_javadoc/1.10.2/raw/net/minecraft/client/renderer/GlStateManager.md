---
title: "GlStateManager"
description: "public class GlStateManager extends java.lang.Object"
package: "net/minecraft/client/renderer"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/renderer/GlStateManager.html"
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
- `static void enableOutlineMode(int p_187431_0_)`
- `static void enablePolygonOffset()`
- `static void enableRescaleNormal()`
- `static void enableTexGenCoord(GlStateManager.TexGen texGen)`
- `static void enableTexture2D()`
- `static int generateTexture()`
- `static void getFloat(int pname, java.nio.FloatBuffer params)`
- `static void glBegin(int p_187447_0_)`
- `static void glBlendEquation(int blendEquation)`
- `static void glColorPointer(int p_187400_0_, int p_187400_1_, int p_187400_2_, java.nio.ByteBuffer p_187400_3_)`
- `static void glColorPointer(int p_187406_0_, int p_187406_1_, int p_187406_2_, int p_187406_3_)`
- `static void glCopyTexSubImage2D(int p_187443_0_, int p_187443_1_, int p_187443_2_, int p_187443_3_, int p_187443_4_, int p_187443_5_, int p_187443_6_, int p_187443_7_)`
- `static void glDeleteLists(int p_187449_0_, int p_187449_1_)`
- `static void glDisableClientState(int p_187429_0_)`
- `static void glDrawArrays(int p_187439_0_, int p_187439_1_, int p_187439_2_)`
- `static void glEnableClientState(int p_187410_0_)`
- `static void glEnd()`
- `static void glEndList()`
- `static void glFog(int pname, java.nio.FloatBuffer param)`
- `static void glFogi(int pname, int param)`
- `static int glGenLists(int p_187442_0_)`
- `static int glGetError()`
- `static int glGetInteger(int p_187397_0_)`
- `static void glGetInteger(int p_187445_0_, java.nio.IntBuffer p_187445_1_)`
- `static java.lang.String glGetString(int p_187416_0_)`
- `static void glGetTexImage(int p_187433_0_, int p_187433_1_, int p_187433_2_, int p_187433_3_, java.nio.IntBuffer p_187433_4_)`
- `static int glGetTexLevelParameteri(int p_187411_0_, int p_187411_1_, int p_187411_2_)`
- `static void glLight(int light, int pname, java.nio.FloatBuffer params)`
- `static void glLightModel(int pname, java.nio.FloatBuffer params)`
- `static void glLineWidth(float p_187441_0_)`
- `static void glNewList(int p_187423_0_, int p_187423_1_)`
- `static void glNormal3f(float nx, float ny, float nz)`
- `static void glNormalPointer(int p_187446_0_, int p_187446_1_, java.nio.ByteBuffer p_187446_2_)`
- `static void glPixelStorei(int p_187425_0_, int p_187425_1_)`
- `static void glPolygonMode(int face, int mode)`
- `static void glReadPixels(int p_187413_0_, int p_187413_1_, int p_187413_2_, int p_187413_3_, int p_187413_4_, int p_187413_5_, java.nio.IntBuffer p_187413_6_)`
- `static void glTexCoord2f(float p_187426_0_, float p_187426_1_)`
- `static void glTexCoordPointer(int p_187404_0_, int p_187404_1_, int p_187404_2_, java.nio.ByteBuffer p_187404_3_)`
- `static void glTexCoordPointer(int p_187405_0_, int p_187405_1_, int p_187405_2_, int p_187405_3_)`
- `static void glTexEnv(int p_187448_0_, int p_187448_1_, java.nio.FloatBuffer p_187448_2_)`
- `static void glTexEnvf(int p_187436_0_, int p_187436_1_, float p_187436_2_)`
- `static void glTexEnvi(int p_187399_0_, int p_187399_1_, int p_187399_2_)`
- `static void glTexImage2D(int p_187419_0_, int p_187419_1_, int p_187419_2_, int p_187419_3_, int p_187419_4_, int p_187419_5_, int p_187419_6_, int p_187419_7_, java.nio.IntBuffer p_187419_8_)`
- `static void glTexParameterf(int p_187403_0_, int p_187403_1_, float p_187403_2_)`
- `static void glTexParameteri(int p_187421_0_, int p_187421_1_, int p_187421_2_)`
- `static void glTexSubImage2D(int p_187414_0_, int p_187414_1_, int p_187414_2_, int p_187414_3_, int p_187414_4_, int p_187414_5_, int p_187414_6_, int p_187414_7_, java.nio.IntBuffer p_187414_8_)`
- `static void glVertex3f(float p_187435_0_, float p_187435_1_, float p_187435_2_)`
- `static void glVertexPointer(int p_187427_0_, int p_187427_1_, int p_187427_2_, java.nio.ByteBuffer p_187427_3_)`
- `static void glVertexPointer(int p_187420_0_, int p_187420_1_, int p_187420_2_, int p_187420_3_)`
- `static void loadIdentity()`
- `static void matrixMode(int mode)`
- `static void multMatrix(java.nio.FloatBuffer matrix)`
- `static void ortho(double left, double right, double bottom, double top, double zNear, double zFar)`
- `static void popAttrib()`
- `static void popMatrix()`
- `static void pushAttrib()`
- `static void pushMatrix()`
- `static java.nio.FloatBuffer quatToGlMatrix(java.nio.FloatBuffer p_187418_0_, org.lwjgl.util.vector.Quaternion p_187418_1_)`
- `static void resetColor()`
- `static void rotate(float angle, float x, float y, float z)`
- `static void rotate(org.lwjgl.util.vector.Quaternion p_187444_0_)`
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
