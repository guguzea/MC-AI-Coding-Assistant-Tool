---
title: "GlStateManager"
description: "public class GlStateManager extends java.lang.Object"
package: "net/minecraft/client/renderer"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/GlStateManager.html"
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
- `public static void disableDepth()`
- `public static void enableDepth()`
- `public static void depthFunc(int depthFunc)`
- `public static void depthMask(boolean flagIn)`
- `public static void disableBlend()`
- `public static void enableBlend()`
- `public static void blendFunc(int srcFactor, int dstFactor)`
- `public static void tryBlendFuncSeparate(int srcFactor, int dstFactor, int srcFactorAlpha, int dstFactorAlpha)`
- `public static void enableFog()`
- `public static void disableFog()`
- `public static void setFog(int param)`
- `public static void setFogDensity(float param)`
- `public static void setFogStart(float param)`
- `public static void setFogEnd(float param)`
- `public static void enableCull()`
- `public static void disableCull()`
- `public static void cullFace(int mode)`
- `public static void enablePolygonOffset()`
- `public static void disablePolygonOffset()`
- `public static void doPolygonOffset(float factor, float units)`
- `public static void enableColorLogic()`
- `public static void disableColorLogic()`
- `public static void colorLogicOp(int opcode)`
- `public static void enableTexGenCoord( GlStateManager.TexGen p_179087_0_)`
- `public static void disableTexGenCoord( GlStateManager.TexGen p_179100_0_)`
- `public static void texGen( GlStateManager.TexGen texGen, int param)`
- `public static void texGen( GlStateManager.TexGen p_179105_0_, int pname, java.nio.FloatBuffer params)`
- `public static void setActiveTexture(int texture)`
- `public static void enableTexture2D()`
- `public static void disableTexture2D()`
- `public static int generateTexture()`
- `public static void deleteTexture(int texture)`
- `public static void bindTexture(int texture)`
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
- `public static void color(float colorRed, float colorGreen, float colorBlue, float colorAlpha)`
- `public static void color(float colorRed, float colorGreen, float colorBlue)`
- `public static void resetColor()`
- `public static void callList(int list)`
