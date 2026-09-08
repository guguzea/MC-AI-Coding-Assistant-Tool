package com.example.examplemod;

import net.fabricmc.api.ModInitializer;
import net.fabricmc.fabric.api.object.builder.v1.entity.FabricEntityTypeBuilder;
import net.minecraft.entity.EntityType;
import net.minecraft.entity.passive.AnimalEntity;
import net.minecraft.entity.passive.PassiveEntity;
import net.minecraft.server.world.ServerWorld;
import net.minecraft.world.World;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ExampleAnimalEntity extends AnimalEntity {
    public static final Logger LOGGER = LoggerFactory.getLogger("examplemod");

    public ExampleAnimalEntity(EntityType<? extends AnimalEntity> entityType, World world) {
        super(entityType, world);
    }

    @Override
    public boolean isBreedingItem(net.minecraft.item.ItemStack stack) {
        // 可以添加自定义繁殖逻辑
        return false;
    }

    @Override
    @SuppressWarnings("unchecked")
    public ExampleAnimalEntity createChild(ServerWorld world, PassiveEntity other) {
        // getType() 只给出 EntityType<?>；本类未在 ExampleMod 注册，无强类型字段可用
        return new ExampleAnimalEntity((EntityType<? extends AnimalEntity>) this.getType(), world);
    }
}
