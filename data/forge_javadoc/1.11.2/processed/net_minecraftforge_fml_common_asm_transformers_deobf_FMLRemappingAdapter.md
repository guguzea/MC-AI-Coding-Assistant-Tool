# FMLRemappingAdapter

**Inheritance:** java.lang.Object → org.objectweb.asm.ClassVisitor → org.objectweb.asm.commons.RemappingClassAdapter → net.minecraftforge.fml.common.asm.transformers.deobf.FMLRemappingAdapter

## Class signature

```java
public class FMLRemappingAdapter extends org.objectweb.asm.commons.RemappingClassAdapter
```

## Methods

- `protected org.objectweb.asm.MethodVisitor createRemappingMethodAdapter(int access, java.lang.String newDesc, org.objectweb.asm.MethodVisitor mv)`
- `void visit(int version, int access, java.lang.String name, java.lang.String signature, java.lang.String superName, java.lang.String[] interfaces)`
- `org.objectweb.asm.FieldVisitor visitField(int access, java.lang.String name, java.lang.String desc, java.lang.String signature, java.lang.Object value)`

## Fields

- `FMLRemappingAdapter`