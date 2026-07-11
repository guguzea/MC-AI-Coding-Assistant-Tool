# 数据生成命令

适用版本：Fabric 1.21.1

## DataGenerator 入口点

```java
public class MyDatagen implements DataGeneratorInitializer {
    @Override
    public void initialize(RegistryWrapper.WrapperLookup registries,
                           DataGenerator generator,
                           Pack.Output output,
                           ExistingFileHelper existingFileHelper) {
        // 注册生成器
    }
}
```

## 注册入口点

```json
{
  "entrypoints": {
    "init_data": ["com.example.examplemod.MyDatagen"]
  }
}
```

## 运行 DataGen

```bash
./gradlew runDatagen
```

## 常见问题

### Q: DataGen 不执行
A: 检查 fabric.mod.json 中是否注册了 init_data 入口点。

### Q: 生成的文件不生效
A: 检查是否在 src/generated/resources 目录（由 Loom 管理），不要手动编辑。

## 相关文件

- rules/07-datagen.mdc
- rules/01-registry.mdc
