# Animation

## Class signature

```java
public enum Animation extends java.lang.Enum< Animation > implements IResourceManagerReloadListener
```

## Methods

- `public static Animation [] values()`
- `public static Animation valueOf(java.lang.String name)`
- `public static float getWorldTime( World world)`
- `public static float getWorldTime( World world, float tickProgress)`
- `public static float getPartialTickTime()`
- `public IAnimationStateMachine load( ResourceLocation location, <any> customParameters)`
- `public ModelBlockAnimation loadVanillaAnimation( ResourceLocation armatureLocation)`
- `public static void setClientPartialTickTime(float clientPartialTickTime)`
- `public void onResourceManagerReload( IResourceManager manager)`

## Description

Get current partialTickTime.