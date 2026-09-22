---
title: "RealmsSliderButton"
description: "public class RealmsSliderButton extends RealmsButton"
package: "net/minecraft/realms"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/realms/RealmsSliderButton.html"
sourceType: javadoc
---

# RealmsSliderButton

**Inheritance:** java.lang.Object → net.minecraft.realms.RealmsButton → net.minecraft.realms.RealmsSliderButton

## Class signature

```java
public class RealmsSliderButton extends RealmsButton
```

## Constructors

- `RealmsSliderButton(int buttonId, int x, int y, int width, int maxValueIn, int p_i1056_6_)`
- `RealmsSliderButton(int buttonId, int x, int y, int width, int p_i1057_5_, int valueIn, float minValueIn, float maxValueIn)`

## Methods

- `float clamp(float p_clamp_1_)`
- `protected float clampSteps(float p_clampSteps_1_)`
- `void clicked(float p_clicked_1_)`
- `void clicked(int p_clicked_1_, int p_clicked_2_)`
- `java.lang.String getMessage()`
- `int getYImage(boolean p_getYImage_1_)`
- `void released(int p_released_1_, int p_released_2_)`
- `void renderBg(int p_renderBg_1_, int p_renderBg_2_)`
- `float toPct(float p_toPct_1_)`
- `float toValue(float p_toValue_1_)`

## Fields

- `boolean sliding`
- `float value`
