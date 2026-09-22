---
title: "GlStateManager"
description: "public class GlStateManager extends java.lang.Object"
package: "net/minecraft/client/renderer"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/GlStateManager.html"
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
- `static void blendFunc(int srcFactor, int dstFactor)`
- `static void callList(int list)`
- `static void clear(int mask)`
- `static void clearColor(float red, float green, float blue, float alpha)`
- `static void clearDepth(double depth)`
- `static void color(float colorRed, float colorGreen, float colorBlue)`
- `static void color(float colorRed, float colorGreen, float colorBlue, float colorAlpha)`
- `static void colorLogicOp(int opcode)`
- `static void colorMask(boolean red, boolean green, boolean blue, boolean alpha)`
- `static void colorMaterial(int face, int mode)`
- `static void cullFace(int mode)`
- `static void deleteTexture(int texture)`
- `static void depthFunc(int depthFunc)`
- `static void depthMask(boolean flagIn)`
- `static void disableAlpha()`
- `static void disableBlend()`
- `static void disableColorLogic()`
- `static void disableColorMaterial()`
- `static void disableCull()`
- `static void disableDepth()`
- `static void disableFog()`
- `static void disableLight(int light)`
- `static void disableLighting()`
- `static void disableNormalize()`
- `static void disablePolygonOffset()`
- `static void disableRescaleNormal()`
- `static void disableTexGenCoord(GlStateManager.TexGen p_179100_0_)`
- `static void disableTexture2D()`
- `static void doPolygonOffset(float factor, float units)`
- `static void enableAlpha()`
- `static void enableBlend()`
- `static void enableColorLogic()`
- `static void enableColorMaterial()`
- `static void enableCull()`
- `static void enableDepth()`
- `static void enableFog()`
- `static void enableLight(int light)`
- `static void enableLighting()`
- `static void enableNormalize()`
- `static void enablePolygonOffset()`
- `static void enableRescaleNormal()`
- `static void enableTexGenCoord(GlStateManager.TexGen p_179087_0_)`
- `static void enableTexture2D()`
- `static int generateTexture()`
- `static void getFloat(int pname, java.nio.FloatBuffer params)`
- `static void loadIdentity()`
- `static void matrixMode(int mode)`
- `static void multMatrix(java.nio.FloatBuffer matrix)`
- `static void ortho(double left, double right, double bottom, double top, double zNear, double zFar)`
- `static void popAttrib()`
- `static void popMatrix()`
- `static void pushAttrib()`
- `static void pushMatrix()`
- `static void resetColor()`
- `static void rotate(float angle, float x, float y, float z)`
- `static void scale(double x, double y, double z)`
- `static void scale(float x, float y, float z)`
- `static void setActiveTexture(int texture)`
- `static void setFog(int param)`
- `static void setFogDensity(float param)`
- `static void setFogEnd(float param)`
- `static void setFogStart(float param)`
- `static void shadeModel(int mode)`
- `static void texGen(GlStateManager.TexGen texGen, int param)`
- `static void texGen(GlStateManager.TexGen p_179105_0_, int pname, java.nio.FloatBuffer params)`
- `static void translate(double x, double y, double z)`
- `static void translate(float x, float y, float z)`
- `static void tryBlendFuncSeparate(int srcFactor, int dstFactor, int srcFactorAlpha, int dstFactorAlpha)`
- `static void viewport(int x, int y, int width, int height)`
