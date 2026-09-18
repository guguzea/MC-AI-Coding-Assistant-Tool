# ModAnnotationVisitor

## Class signature

```java
public class ModAnnotationVisitor extends org.objectweb.asm.AnnotationVisitor
```

## Constructors

- `public ModAnnotationVisitor( ASMModParser discoverer)`
- `public ModAnnotationVisitor( ASMModParser discoverer, java.lang.String name)`
- `public ModAnnotationVisitor( ASMModParser discoverer, boolean isSubAnnotation)`

## Methods

- `public void visit(java.lang.String key, java.lang.Object value)`
- `public void visitEnum(java.lang.String name, java.lang.String desc, java.lang.String value)`
- `public org.objectweb.asm.AnnotationVisitor visitArray(java.lang.String name)`
- `public org.objectweb.asm.AnnotationVisitor visitAnnotation(java.lang.String name, java.lang.String desc)`
- `public void visitEnd()`