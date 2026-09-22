# FMLRemappingAdapter

**Inheritance:** java.lang.Object → RemappingClassAdapter → cpw.mods.fml.common.asm.transformers.deobf.FMLRemappingAdapter

## Class signature

```java
public class FMLRemappingAdapter extends RemappingClassAdapter
```

## Constructors

- `FMLRemappingAdapter(ClassVisitor cv)`

## Methods

- `protected MethodVisitor createRemappingMethodAdapter(int access, java.lang.String newDesc, MethodVisitor mv)`
- `void visit(int version, int access, java.lang.String name, java.lang.String signature, java.lang.String superName, java.lang.String[] interfaces)`