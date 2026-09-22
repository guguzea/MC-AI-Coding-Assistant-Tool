# ModClassVisitor

**Inheritance:** java.lang.Object → org.objectweb.asm.ClassVisitor → net.minecraftforge.fml.common.discovery.asm.ModClassVisitor

## Class signature

```java
public class ModClassVisitor extends org.objectweb.asm.ClassVisitor
```

## Methods

- `void visit(int version, int access, java.lang.String name, java.lang.String signature, java.lang.String superName, java.lang.String[] interfaces)`
- `org.objectweb.asm.AnnotationVisitor visitAnnotation(java.lang.String annotationName, boolean runtimeVisible)`
- `org.objectweb.asm.FieldVisitor visitField(int access, java.lang.String name, java.lang.String desc, java.lang.String signature, java.lang.Object value)`
- `org.objectweb.asm.MethodVisitor visitMethod(int access, java.lang.String name, java.lang.String desc, java.lang.String signature, java.lang.String[] exceptions)`

## Fields

- `ModClassVisitor`