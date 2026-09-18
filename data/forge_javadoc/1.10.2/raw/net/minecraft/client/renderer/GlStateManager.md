---
title: "GlStateManager"
description: "public class GlStateManager extends java.lang.Object"
package: "net/minecraft/client/renderer"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/renderer/GlStateManager.html"
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
- `public static void enableOutlineMode(int p_187431_0_)`
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
- `public static void glTexEnv(int p_187448_0_, int p_187448_1_, java.nio.FloatBuffer p_187448_2_)`
- `public static void glTexEnvi(int p_187399_0_, int p_187399_1_, int p_187399_2_)`
- `public static void glTexEnvf(int p_187436_0_, int p_187436_1_, float p_187436_2_)`
- `public static void glTexParameterf(int p_187403_0_, int p_187403_1_, float p_187403_2_)`
- `public static void glTexParameteri(int p_187421_0_, int p_187421_1_, int p_187421_2_)`
- `public static int glGetTexLevelParameteri(int p_187411_0_, int p_187411_1_, int p_187411_2_)`
- `public static int generateTexture()`
- `public static void deleteTexture(int texture)`
- `public static void bindTexture(int texture)`
- `public static void glTexImage2D(int p_187419_0_, int p_187419_1_, int p_187419_2_, int p_187419_3_, int p_187419_4_, int p_187419_5_, int p_187419_6_, int p_187419_7_, @Nullable java.nio.IntBuffer p_187419_8_)`
- `public static void glTexSubImage2D(int p_187414_0_, int p_187414_1_, int p_187414_2_, int p_187414_3_, int p_187414_4_, int p_187414_5_, int p_187414_6_, int p_187414_7_, java.nio.IntBuffer p_187414_8_)`
- `public static void glCopyTexSubImage2D(int p_187443_0_, int p_187443_1_, int p_187443_2_, int p_187443_3_, int p_187443_4_, int p_187443_5_, int p_187443_6_, int p_187443_7_)`
- `public static void glGetTexImage(int p_187433_0_, int p_187433_1_, int p_187433_2_, int p_187433_3_, java.nio.IntBuffer p_187433_4_)`
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
- `public static void rotate(org.lwjgl.util.vector.Quaternion p_187444_0_)`
- `public static java.nio.FloatBuffer quatToGlMatrix(java.nio.FloatBuffer p_187418_0_, org.lwjgl.util.vector.Quaternion p_187418_1_)`
- `public static void color(float colorRed, float colorGreen, float colorBlue, float colorAlpha)`
- `public static void color(float colorRed, float colorGreen, float colorBlue)`
- `public static void glTexCoord2f(float p_187426_0_, float p_187426_1_)`
- `public static void glVertex3f(float p_187435_0_, float p_187435_1_, float p_187435_2_)`
- `public static void resetColor()`
- `public static void glNormalPointer(int p_187446_0_, int p_187446_1_, java.nio.ByteBuffer p_187446_2_)`
- `public static void glTexCoordPointer(int p_187405_0_, int p_187405_1_, int p_187405_2_, int p_187405_3_)`
- `public static void glTexCoordPointer(int p_187404_0_, int p_187404_1_, int p_187404_2_, java.nio.ByteBuffer p_187404_3_)`
- `public static void glVertexPointer(int p_187420_0_, int p_187420_1_, int p_187420_2_, int p_187420_3_)`
- `public static void glVertexPointer(int p_187427_0_, int p_187427_1_, int p_187427_2_, java.nio.ByteBuffer p_187427_3_)`
- `public static void glColorPointer(int p_187406_0_, int p_187406_1_, int p_187406_2_, int p_187406_3_)`
- `public static void glColorPointer(int p_187400_0_, int p_187400_1_, int p_187400_2_, java.nio.ByteBuffer p_187400_3_)`
- `public static void glDisableClientState(int p_187429_0_)`
- `public static void glEnableClientState(int p_187410_0_)`
- `public static void glBegin(int p_187447_0_)`
- `public static void glEnd()`
- `public static void glDrawArrays(int p_187439_0_, int p_187439_1_, int p_187439_2_)`
- `public static void glLineWidth(float p_187441_0_)`
- `public static void callList(int list)`
- `public static void glDeleteLists(int p_187449_0_, int p_187449_1_)`
- `public static void glNewList(int p_187423_0_, int p_187423_1_)`
- `public static void glEndList()`
- `public static int glGenLists(int p_187442_0_)`
- `public static void glPixelStorei(int p_187425_0_, int p_187425_1_)`
- `public static void glReadPixels(int p_187413_0_, int p_187413_1_, int p_187413_2_, int p_187413_3_, int p_187413_4_, int p_187413_5_, java.nio.IntBuffer p_187413_6_)`
- `public static int glGetError()`
- `public static java.lang.String glGetString(int p_187416_0_)`
- `public static void glGetInteger(int p_187445_0_, java.nio.IntBuffer p_187445_1_)`
- `public static int glGetInteger(int p_187397_0_)`
