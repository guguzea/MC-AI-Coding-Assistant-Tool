# 配方开发命令

适用版本：Fabric 1.21.1

## 配方生成

```java
public class MyRecipeProvider implements DataStreamOutputSupplier.Writer {
    @Override
    public void generate(RegistryWrapper.WrapperLookup registries,
                         DataGenerator.GeneratorOutput output,
                         ExistingFileHelper existingFileHelper) {
        ShapedRecipeJsonBuilder.create(
                RecipeProvider.getItemConvertible(MY_ITEM.get()), 1)
            .pattern("AAA")
            .pattern("BBB")
            .pattern("CCC")
            .input('A', Items.DIAMOND)
            .input('B', Items.GOLD_INGOT)
            .input('C', Items.IRON_INGOT)
            .criterion(hasItem(Items.DIAMOND),
                conditionsFromItem(Items.DIAMOND))
            .offerTo(exporter);
    }
}
```

## 常见问题

### Q: 配方不生效
A: 检查 JSON 格式是否正确，pattern 字符是否对齐。

### Q: 配方条件不满足
A: 检查 criterion 中引用的物品/条件是否正确。

## 相关文件

- rules/07-datagen.mdc
