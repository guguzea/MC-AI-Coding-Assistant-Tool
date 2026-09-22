---
title: "MathHelper"
description: "public class MathHelper extends java.lang.Object"
package: "net/minecraft/util"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/util/MathHelper.html"
sourceType: javadoc
---

# MathHelper

**Inheritance:** java.lang.Object → net.minecraft.util.MathHelper

## Class signature

```java
public class MathHelper extends java.lang.Object
```

## Constructors

- `MathHelper()`

## Methods

- `static int abs_int(int value)` — Returns the unsigned value of an int.
- `static double abs_max(double p_76132_0_, double p_76132_2_)` — Maximum of the absolute value of two numbers.
- `static float abs(float value)`
- `static double atan2(double p_181159_0_, double p_181159_2_)`
- `static double average(long[] values)`
- `static int bucketInt(int p_76137_0_, int p_76137_1_)` — Buckets an integer with specifed bucket sizes.
- `static int calculateLogBaseTwo(int value)` — Efficiently calculates the floor of the base-2 log of an integer value.
- `static int ceiling_double_int(double value)`
- `static int ceiling_float_int(float value)`
- `static double clamp_double(double num, double min, double max)`
- `static float clamp_float(float num, float min, float max)` — Returns the value of the first parameter, clamped to be within the lower and upper limits given by the second and third parameters
- `static int clamp_int(int num, int min, int max)` — Returns the value of the first parameter, clamped to be within the lower and upper limits given by the second and third parameters.
- `static float cos(float value)` — cos looked up in the sin table with the appropriate offset
- `static double denormalizeClamp(double p_151238_0_, double p_151238_2_, double p_151238_4_)`
- `static boolean epsilonEquals(float p_180185_0_, float p_180185_1_)`
- `static long floor_double_long(double value)` — Long version of floor_double
- `static int floor_double(double value)` — Returns the greatest integer less than or equal to the double argument
- `static int floor_float(float value)` — Returns the greatest integer less than or equal to the float argument
- `static int func_154353_e(double value)`
- `static int func_180181_b(int p_180181_0_, int p_180181_1_, int p_180181_2_)`
- `static int func_180183_b(float p_180183_0_, float p_180183_1_, float p_180183_2_)`
- `static int func_180188_d(int p_180188_0_, int p_180188_1_)`
- `static double func_181160_c(double p_181160_0_, double p_181160_2_, double p_181160_4_)`
- `static double func_181161_i(double p_181161_0_)`
- `static double func_181162_h(double p_181162_0_)`
- `static long getCoordinateRandom(int x, int y, int z)`
- `static long getPositionRandom(Vec3i pos)`
- `static double getRandomDoubleInRange(java.util.Random p_82716_0_, double p_82716_1_, double p_82716_3_)`
- `static int getRandomIntegerInRange(java.util.Random p_76136_0_, int p_76136_1_, int p_76136_2_)`
- `static java.util.UUID getRandomUuid(java.util.Random rand)`
- `static int hsvToRGB(float p_181758_0_, float p_181758_1_, float p_181758_2_)`
- `static int normalizeAngle(int p_180184_0_, int p_180184_1_)`
- `static double parseDoubleWithDefault(java.lang.String p_82712_0_, double p_82712_1_)` — parses the string as double or returns the second parameter if it fails.
- `static double parseDoubleWithDefaultAndMax(java.lang.String p_82713_0_, double p_82713_1_, double p_82713_3_)`
- `static int parseIntWithDefault(java.lang.String p_82715_0_, int p_82715_1_)` — parses the string as integer or returns the second parameter if it fails
- `static int parseIntWithDefaultAndMax(java.lang.String p_82714_0_, int p_82714_1_, int p_82714_2_)` — parses the string as integer or returns the second parameter if it fails. this value is capped to par2
- `static float randomFloatClamp(java.util.Random p_151240_0_, float p_151240_1_, float p_151240_2_)`
- `static int roundUp(int p_154354_0_, int p_154354_1_)`
- `static int roundUpToPowerOfTwo(int value)` — Returns the input value rounded up to the next highest power of two.
- `static float sin(float p_76126_0_)` — sin looked up in a table
- `static float sqrt_double(double value)`
- `static float sqrt_float(float value)`
- `static int truncateDoubleToInt(double value)` — returns par0 cast as an int, and no greater than Integer.MAX_VALUE-1024
- `static double wrapAngleTo180_double(double value)` — the angle is reduced to an angle between -180 and +180 by mod, and a 360 check
- `static float wrapAngleTo180_float(float value)` — the angle is reduced to an angle between -180 and +180 by mod, and a 360 check

## Fields

- `static float SQRT_2`
