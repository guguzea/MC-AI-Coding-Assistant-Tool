# MathHelper

## Class signature

```java
public class MathHelper extends java.lang.Object
```

## Constructors

- `public MathHelper()`

## Methods

- `public static float sin(float value)`
- `public static float cos(float value)`
- `public static float sqrt_float(float value)`
- `public static float sqrt_double(double value)`
- `public static int floor_float(float value)`
- `public static int truncateDoubleToInt(double value)`
- `public static int floor_double(double value)`
- `public static long floor_double_long(double value)`
- `public static int absFloor(double value)`
- `public static float abs(float value)`
- `public static int abs_int(int value)`
- `public static int ceiling_float_int(float value)`
- `public static int ceiling_double_int(double value)`
- `public static int clamp_int(int num, int min, int max)`
- `public static float clamp_float(float num, float min, float max)`
- `public static double clamp_double(double num, double min, double max)`
- `public static double denormalizeClamp(double lowerBnd, double upperBnd, double slide)`
- `public static double abs_max(double p_76132_0_, double p_76132_2_)`
- `public static int bucketInt(int p_76137_0_, int p_76137_1_)`
- `public static int getRandomIntegerInRange(java.util.Random random, int minimum, int maximum)`
- `public static float randomFloatClamp(java.util.Random random, float minimum, float maximum)`
- `public static double getRandomDoubleInRange(java.util.Random random, double minimum, double maximum)`
- `public static double average(long[] values)`
- `public static boolean epsilonEquals(float p_180185_0_, float p_180185_1_)`
- `public static int normalizeAngle(int p_180184_0_, int p_180184_1_)`
- `public static float positiveModulo(float numerator, float denominator)`
- `public static float wrapDegrees(float value)`
- `public static double wrapDegrees(double value)`
- `public static int clampAngle(int angle)`
- `public static int parseIntWithDefault(java.lang.String value, int defaultValue)`
- `public static int parseIntWithDefaultAndMax(java.lang.String value, int defaultValue, int max)`
- `public static double parseDoubleWithDefault(java.lang.String value, double defaultValue)`
- `public static double parseDoubleWithDefaultAndMax(java.lang.String value, double defaultValue, double max)`
- `public static int roundUpToPowerOfTwo(int value)`
- `public static int calculateLogBaseTwoDeBruijn(int value)`
- `public static int calculateLogBaseTwo(int value)`
- `public static int roundUp(int number, int interval)`
- `public static int rgb(float rIn, float gIn, float bIn)`
- `public static int rgb(int rIn, int gIn, int bIn)`
- `public static int multiplyColor(int p_180188_0_, int p_180188_1_)`
- `public static double frac(double number)`
- `public static long getPositionRandom( Vec3i pos)`
- `public static java.util.UUID getRandomUuid(java.util.Random rand)`
- `public static java.util.UUID getRandomUUID()`
- `public static long getCoordinateRandom(int x, int y, int z)`
- `public static double pct(double p_181160_0_, double p_181160_2_, double p_181160_4_)`
- `public static double atan2(double p_181159_0_, double p_181159_2_)`
- `public static double fastInvSqrt(double p_181161_0_)`
- `public static int hsvToRGB(float hue, float saturation, float value)`
- `public static int getHash(int p_188208_0_)`