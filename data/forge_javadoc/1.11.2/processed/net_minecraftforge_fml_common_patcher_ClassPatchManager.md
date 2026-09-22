# ClassPatchManager

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.patcher.ClassPatchManager

## Class signature

```java
public class ClassPatchManager extends java.lang.Object
```

## Methods

- `byte[] applyPatch(java.lang.String name, java.lang.String mappedName, byte[] inputData)`
- `byte[] getPatchedResource(java.lang.String name, java.lang.String mappedName, net.minecraft.launchwrapper.LaunchClassLoader loader)`
- `void setup(Side side)`

## Fields

- `static boolean DEBUG`
- `static boolean dumpPatched`
- `static ClassPatchManager INSTANCE`