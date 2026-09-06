package com.example.docs.appearance;

import net.minecraft.client.color.item.ItemTintSources;
import net.minecraft.client.renderer.chunk.ChunkSectionLayer;
import net.minecraft.resources.Identifier;
import net.minecraft.world.level.block.Blocks;
import net.minecraft.world.level.block.state.BlockState;

import net.fabricmc.api.ClientModInitializer;
import net.fabricmc.fabric.api.client.render.fluid.v1.FluidRenderHandlerRegistry;
import net.fabricmc.fabric.api.client.render.fluid.v1.SimpleFluidRenderHandler;
import net.fabricmc.fabric.api.client.rendering.v1.BlockRenderLayerMap;
import net.fabricmc.fabric.api.client.rendering.v1.ColorProviderRegistry;

import com.example.docs.ExampleMod;
import com.example.docs.block.ModBlocks;
import com.example.docs.fluid.ModFluids;

public class ExampleModAppearanceClient implements ClientModInitializer {
	@Override
	public void onInitializeClient() {
		// :::item_tint_source
		ItemTintSources.ID_MAPPER.put(Identifier.fromNamespaceAndPath(ExampleMod.MOD_ID, "color"), RainTintSource.MAP_CODEC);
		// :::item_tint_source
		// :::color_provider
		ColorProviderRegistry.BLOCK.register((blockState, blockAndTintGetter, blockPos, i) -> {
			if (blockAndTintGetter != null && blockPos != null) {
				BlockState stateBelow = blockAndTintGetter.getBlockState(blockPos.below());

				if (stateBelow.is(Blocks.GRASS_BLOCK)) {
					return 0x98FB98; // Color code in hex format
				}
			}

			return 0xFFDAB9; // Color code in hex format
		}, ExampleModAppearance.WAXCAP_BLOCK);
		// :::color_provider

		// :::block_render_layer_map
		BlockRenderLayerMap.putBlock(ExampleModAppearance.WAXCAP_BLOCK, ChunkSectionLayer.CUTOUT);
		// :::block_render_layer_map

		// :::fluid_texture
		FluidRenderHandlerRegistry.INSTANCE.register(
				ModFluids.ACID_STILL,
				ModFluids.ACID_FLOWING,
				new SimpleFluidRenderHandler(
						// Source texture
						SimpleFluidRenderHandler.WATER_STILL,
						// Flowing texture
						SimpleFluidRenderHandler.WATER_FLOWING,
						0x075800
				)
		);
		// :::fluid_texture
		// :::fluid_transparency
		BlockRenderLayerMap.putBlock(ModBlocks.ACID, ChunkSectionLayer.TRANSLUCENT);
		// :::fluid_transparency
	}
}
