# ModClassVisitor

## Class signature

```java
public class ModClassVisitor extends ClassVisitor
```

## Constructors

- `public ModClassVisitor( ASMModParser discoverer)`

## Methods

- `public void visit(int version, int access, java.lang.String name, java.lang.String signature, java.lang.String superName, java.lang.String[] interfaces)`
- `public AnnotationVisitor visitAnnotation(java.lang.String annotationName, boolean runtimeVisible)`
- `public FieldVisitor visitField(int access, java.lang.String name, java.lang.String desc, java.lang.String signature, java.lang.Object value)`
- `public MethodVisitor visitMethod(int access, java.lang.String name, java.lang.String desc, java.lang.String signature, java.lang.String[] exceptions)`