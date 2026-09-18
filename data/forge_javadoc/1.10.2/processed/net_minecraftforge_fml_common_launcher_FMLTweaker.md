# FMLTweaker

## Class signature

```java
public class FMLTweaker extends java.lang.Object implements net.minecraft.launchwrapper.ITweaker
```

## Constructors

- `public FMLTweaker()`

## Methods

- `public void acceptOptions(java.util.List<java.lang.String> args, java.io.File gameDir, java.io.File assetsDir, java.lang.String profile)`
- `public void injectIntoClassLoader(net.minecraft.launchwrapper.LaunchClassLoader classLoader)`
- `public java.lang.String getLaunchTarget()`
- `public java.lang.String[] getLaunchArguments()`
- `public java.io.File getGameDir()`
- `public static java.net.URI getJarLocation()`
- `public void injectCascadingTweak(java.lang.String tweakClassName)`