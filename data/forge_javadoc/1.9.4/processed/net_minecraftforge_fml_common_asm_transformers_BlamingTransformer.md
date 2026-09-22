# BlamingTransformer

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.asm.transformers.BlamingTransformer

## Class signature

```java
public class BlamingTransformer extends java.lang.Object implements net.minecraft.launchwrapper.IClassTransformer
```

## Constructors

- `BlamingTransformer()`

## Methods

- `static void addClasses(java.lang.String modId, java.util.Set<java.lang.String> classList)`
- `static void blame(java.lang.String modId, java.lang.String cls)`
- `static void onCrash(java.lang.StringBuilder builder)`
- `byte[] transform(java.lang.String name, java.lang.String transformedName, byte[] bytes)`