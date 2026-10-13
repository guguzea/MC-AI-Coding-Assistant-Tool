/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.gui.startup;

import static com.mumfrey.liteloader.gl.GL.*;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import javax.imageio.ImageIO;

import org.lwjgl.opengl.Display;

import com.mumfrey.liteloader.common.LoadingProgress;
import com.mumfrey.liteloader.util.log.LiteLoaderLogger;

import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.FontRenderer;
import net.minecraft.client.gui.ScaledResolution;
import net.minecraft.client.renderer.Tessellator;
import net.minecraft.client.renderer.BufferBuilder;
import net.minecraft.client.renderer.texture.DynamicTexture;
import net.minecraft.client.renderer.texture.ITextureObject;
import net.minecraft.client.renderer.texture.TextureManager;
import net.minecraft.client.resources.IResource;
import net.minecraft.client.resources.IResourceManager;
import net.minecraft.client.shader.Framebuffer;
import net.minecraft.util.ResourceLocation;

/**
 * Crappy implementation of a "Mojang Screen" loading bar
 *
 * @author Adam Mummery-Smith
 */
public class LoadingBar extends LoadingProgress
{
    private static LoadingBar instance;

    private static final int MAX_MINECRAFT_PROGRESS = 90;
    private static final int LITELOADER_PROGRESS_SCALE = 2;

    private static final String LOADING_MESSAGE_1 = "Starting Game...";
    private static final String LOADING_MESSAGE_2 = "Initialising...";

    private int minecraftProgress = 0;
    private int totalMinecraftProgress = LoadingBar.MAX_MINECRAFT_PROGRESS;

    private int liteLoaderProgress = 0;
    private int totalLiteLoaderProgress = 0;

    private ResourceLocation textureLocation = new ResourceLocation("textures/gui/title/mojang.png");

    private String minecraftMessage = LoadingBar.LOADING_MESSAGE_1;
    private String message = "";

    private Minecraft minecraft;
    private TextureManager textureManager;
    private FontRenderer fontRenderer;

    private Framebuffer fbo;

    private boolean enabled = true;
    private boolean errored;

    private boolean calculatedColour = false;
    private int barLuma = 0, r2 = 246, g2 = 136, b2 = 62;

    private int logIndex = 0;
    private List<String> logTail = new ArrayList<String>();

    public LoadingBar()
    {
        LoadingBar.instance = this;
    }

    @Override
    protected void _setEnabled(boolean enabled)
    {
        this.enabled = enabled;
    }

    @Override
    protected void _dispose()
    {
        this.minecraft = null;
        this.textureManager = null;
        this.fontRenderer = null;

        this.disposeFbo();
    }

    private void disposeFbo()
    {
        if (this.fbo != null)
        {
            this.fbo.func_147608_a();
            this.fbo = null;
        }
    }

    public static void incrementProgress()
    {
        if (LoadingBar.instance != null) LoadingBar.instance._incrementProgress();
    }

    protected void _incrementProgress()
    {
        this.message = this.minecraftMessage;

        this.minecraftProgress++;
        this.render();
    }

    public static void initTextures()
    {
        if (LoadingBar.instance != null) LoadingBar.instance._initTextures();
    }

    protected void _initTextures()
    {
        this.minecraftMessage = LoadingBar.LOADING_MESSAGE_2;
    }

    @Override
    protected void _incLiteLoaderProgress()
    {
        this.liteLoaderProgress += LoadingBar.LITELOADER_PROGRESS_SCALE;
        this.render();
    }

    @Override
    protected void _setMessage(String message)
    {
        this.message = message;
        this.render();
    }

    @Override
    protected void _incLiteLoaderProgress(String message)
    {
        this.message = message;
        this.liteLoaderProgress += LoadingBar.LITELOADER_PROGRESS_SCALE ;
        this.render();
    }

    @Override
    protected void _incTotalLiteLoaderProgress(int by)
    {
        this.totalLiteLoaderProgress += (by * LoadingBar.LITELOADER_PROGRESS_SCALE);
        this.render();
    }

    /**
     * 
     */
    private void render()
    {
        if (!this.enabled || this.errored) return;

        try
        {
            if (this.minecraft == null) this.minecraft = Minecraft.func_71410_x();
            if (this.textureManager == null) this.textureManager = this.minecraft.func_110434_K();

            if (Display.isCreated() && this.textureManager != null)
            {
                if (this.fontRenderer == null)
                {
                    this.fontRenderer = new FontRenderer(this.minecraft.field_71474_y, new ResourceLocation("textures/font/ascii.png"),
                            this.textureManager, false);
                    this.fontRenderer.func_110549_a(this.minecraft.func_110442_L());
                }

                double totalProgress = this.totalMinecraftProgress + this.totalLiteLoaderProgress;
                double progress = (this.minecraftProgress + this.liteLoaderProgress) / totalProgress;

//                if (progress >= 1.0) LoadingBar.message = "Preparing...";

                this.render(progress);
            }
        }
        catch (Exception ex)
        {
            // Disable the loading bar if ANY errors occur
            this.errored = true;
        }
    }

    /**
     * @param progress
     */
    private void render(double progress)
    {
        if (this.totalMinecraftProgress == -1)
        {
            this.totalMinecraftProgress = LoadingBar.MAX_MINECRAFT_PROGRESS - this.minecraftProgress;
            this.minecraftProgress = 0;
        }

        // Calculate the bar colour if we haven't already done that
        if (!this.calculatedColour)
        {
            this.calculatedColour = true;
            ITextureObject texture = this.textureManager.func_110581_b(this.textureLocation);
            if (texture == null)
            {
                try
                {
                    DynamicTexture textureData = this.loadTexture(this.minecraft.func_110442_L(), this.textureLocation);
                    this.textureLocation = this.minecraft.func_110434_K().func_110578_a("loadingScreen", textureData);
                    this.findMostCommonColour(textureData.func_110565_c());
                    textureData.func_110564_a();
                }
                catch (IOException ex)
                {
                    ex.printStackTrace();
                }
            }
        }

        ScaledResolution scaledResolution = new ScaledResolution(this.minecraft);
        int scaleFactor = scaledResolution.func_78325_e();
        int scaledWidth = scaledResolution.func_78326_a();
        int scaledHeight = scaledResolution.func_78328_b();

        int fboWidth = scaledWidth * scaleFactor;
        int fboHeight = scaledHeight * scaleFactor;

        if (this.fbo == null)
        {
            this.fbo = new Framebuffer(fboWidth, fboHeight, true);
        }
        else if (this.fbo.field_147621_c != fboWidth || this.fbo.field_147618_d != fboHeight)
        {
            this.fbo.func_147613_a(fboWidth, fboHeight);
        }

        this.fbo.func_147610_a(false);

        glMatrixMode(GL_PROJECTION);
        glLoadIdentity();
        glOrtho(0.0D, scaledWidth, scaledHeight, 0.0D, 1000.0D, 3000.0D);

        glMatrixMode(GL_MODELVIEW);
        glLoadIdentity();
        glTranslatef(0.0F, 0.0F, -2000.0F);

        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

        glDisableLighting();
        glDisableFog();
        glDisableDepthTest();
        glEnableTexture2D();

        this.textureManager.func_110577_a(this.textureLocation);
        Tessellator tessellator = Tessellator.func_178181_a();
        BufferBuilder vertexBuffer = tessellator.func_178180_c();
        vertexBuffer.func_181668_a(GL_QUADS, VF_POSITION_TEX_COLOR);
        glColor4f(1.0F, 1.0F, 1.0F, 1.0F);
        vertexBuffer.func_181662_b(0.0D,        scaledHeight, 0.0D).func_187315_a(0.0D, 0.0D).func_181669_b(255, 255, 255, 255).func_181675_d();
        vertexBuffer.func_181662_b(scaledWidth, scaledHeight, 0.0D).func_187315_a(0.0D, 0.0D).func_181669_b(255, 255, 255, 255).func_181675_d();
        vertexBuffer.func_181662_b(scaledWidth, 0.0D,         0.0D).func_187315_a(0.0D, 0.0D).func_181669_b(255, 255, 255, 255).func_181675_d();
        vertexBuffer.func_181662_b(0.0D,        0.0D,         0.0D).func_187315_a(0.0D, 0.0D).func_181669_b(255, 255, 255, 255).func_181675_d();
        tessellator.func_78381_a();

        glColor4f(1.0F, 1.0F, 1.0F, 1.0F);

        int left = (scaledWidth - 256) / 2;
        int top = (scaledHeight - 256) / 2;
        int u1 = 0;
        int v1 = 0;
        int u2 = 256;
        int v2 = 256;

        float texMapScale = 0.00390625F;
        vertexBuffer.func_181668_a(GL_QUADS, VF_POSITION_TEX_COLOR);
        vertexBuffer.func_181662_b(left + 0,  top + v2, 0.0D).func_187315_a((u1 + 0)  * texMapScale, (v1 + v2) * texMapScale).func_181669_b(255, 255, 255, 255).func_181675_d();
        vertexBuffer.func_181662_b(left + u2, top + v2, 0.0D).func_187315_a((u1 + u2) * texMapScale, (v1 + v2) * texMapScale).func_181669_b(255, 255, 255, 255).func_181675_d();
        vertexBuffer.func_181662_b(left + u2, top + 0,  0.0D).func_187315_a((u1 + u2) * texMapScale, (v1 + 0)  * texMapScale).func_181669_b(255, 255, 255, 255).func_181675_d();
        vertexBuffer.func_181662_b(left + 0,  top + 0,  0.0D).func_187315_a((u1 + 0)  * texMapScale, (v1 + 0)  * texMapScale).func_181669_b(255, 255, 255, 255).func_181675_d();
        tessellator.func_78381_a();

        glEnableTexture2D();
        glEnableColorLogic();
        glLogicOp(GL_OR_REVERSE);
        this.fontRenderer.func_78276_b(this.message, 1, scaledHeight - 19, 0xFF000000);

        if (LiteLoaderLogger.DEBUG)
        {
            int logBottom = this.minecraft.field_71440_d - (20 * scaleFactor) - 2;

            glPushMatrix();
            glScalef(1.0F / scaleFactor, 1.0F / scaleFactor, 1.0F);
            this.renderLogTail(logBottom);
            glPopMatrix();
        }

        glDisableColorLogic();
        glEnableTexture2D();

        double barHeight = 10.0D;

        double barWidth = scaledResolution.func_78327_c() - 2.0D;

        glDisableTexture2D();
        glEnableBlend();
        glEnableAlphaTest();
        glAlphaFunc(GL_GREATER, 0.0F);
        glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

//        tessellator.startDrawingQuads();
//        tessellator.setColorRGBA(0, 0, 0, 32);
//        tessellator.addVertex(0.0D,               scaledHeight,                      0.0D);
//        tessellator.setColorRGBA(0, 0, 0, 180);
//        tessellator.addVertex(0.0D + scaledWidth, scaledHeight,                      0.0D);
//        tessellator.setColorRGBA(0, 0, 0, 0);
//        tessellator.addVertex(0.0D + scaledWidth, (scaledHeight / 10),               0.0D);
//        tessellator.addVertex(0.0D,               scaledHeight - (scaledHeight / 3), 0.0D);
//        tessellator.draw();

        vertexBuffer.func_181668_a(GL_QUADS, VF_POSITION);
        float luma = this.barLuma / 255.0F;
        glColor4f(luma, luma, luma, 0.5F);
        vertexBuffer.func_181662_b(0.0D,               scaledHeight,             0.0D).func_181675_d();
        vertexBuffer.func_181662_b(0.0D + scaledWidth, scaledHeight,             0.0D).func_181675_d();
        vertexBuffer.func_181662_b(0.0D + scaledWidth, scaledHeight - barHeight, 0.0D).func_181675_d();
        vertexBuffer.func_181662_b(0.0D,               scaledHeight - barHeight, 0.0D).func_181675_d();
        tessellator.func_78381_a();

        barHeight -= 1;

        vertexBuffer.func_181668_a(GL_QUADS, VF_POSITION_COLOR);
        float r2 = this.r2 / 255.0F;
        float g2 = this.g2 / 255.0F;
        float b2 = this.b2 / 255.0F;
        vertexBuffer.func_181662_b(1.0D + barWidth * progress, scaledHeight - 1,         1.0D).func_181666_a(r2, g2, b2, 1.0F).func_181675_d();
        vertexBuffer.func_181662_b(1.0D + barWidth * progress, scaledHeight - barHeight, 1.0D).func_181666_a(r2, g2, b2, 1.0F).func_181675_d();
        vertexBuffer.func_181662_b(1.0D,                       scaledHeight - barHeight, 1.0D).func_181666_a(0.0F, 0.0F, 0.0F, 1.0F).func_181675_d();
        vertexBuffer.func_181662_b(1.0D,                       scaledHeight - 1,         1.0D).func_181666_a(0.0F, 0.0F, 0.0F, 1.0F).func_181675_d();
        tessellator.func_78381_a();

        glAlphaFunc(GL_GREATER, 0.1F);
        glDisableLighting();
        glDisableFog();
        this.fbo.func_147609_e();

        this.fbo.func_147615_c(fboWidth, fboHeight);

        glEnableAlphaTest();
        glAlphaFunc(GL_GREATER, 0.1F);
//        glFlush();

        this.minecraft.func_175601_h();
    }

    private void renderLogTail(int yPos)
    {
        if (this.logIndex != LiteLoaderLogger.getLogIndex())
        {
            this.logTail = LiteLoaderLogger.getLogTail();
        }

        for (int logIndex = this.logTail.size() - 1; yPos > 10 && logIndex >= 0; logIndex--)
        {
            this.fontRenderer.func_78276_b(this.logTail.get(logIndex), 10, yPos -= 10, 0xFF000000);
        }
    }

    /**
     * Find the most common (approx) colour in the image and assign it to the
     * bar, reduces the palette to 9-bit by stripping the the 5 LSB from each
     * byte to create a 9-bit palette index in the form RRRGGGBBB
     * 
     * @param textureData
     */
    private void findMostCommonColour(int[] textureData)
    {
        // Array of frequency values, indexed by palette index
        int[] freq = new int[512];

        for (int pos = 0; pos < textureData.length; pos++)
        {
            int paletteIndex = ((textureData[pos] >> 21 & 0x7) << 6) + ((textureData[pos] >> 13 & 0x7) << 3) + (textureData[pos] >> 5 & 0x7);
            freq[paletteIndex]++;
        }

        int peak = 0;

        // Black, white and 0x200000 excluded on purpose
        for (int paletteIndex = 2; paletteIndex < 511; paletteIndex++)
        {
            if (freq[paletteIndex] > peak)
            {
                peak = freq[paletteIndex];
                this.setBarColour(paletteIndex);
            }
        }
    }

    /**
     * @param paletteIndex
     */
    private void setBarColour(int paletteIndex)
    {
        this.r2 = this.padComponent((paletteIndex & 0x1C0) >> 1);
        this.g2 = this.padComponent((paletteIndex & 0x38) << 2);
        this.b2 = this.padComponent((paletteIndex & 0x7) << 5);

        this.barLuma = (Math.max(this.r2, Math.max(this.g2, this.b2)) < 64) ? 255 : 0;
    }

    /**
     * Pad LSB with 1's if any MSB are 1 (effectively a bitwise ceil() function)
     * 
     * @param component
     */
    private int padComponent(int component)
    {
        return (component > 0x1F) ? component | 0x1F : component;
    }

    private DynamicTexture loadTexture(IResourceManager resourceManager, ResourceLocation textureLocation) throws IOException
    {
        InputStream inputStream = null;

        try
        {
            IResource resource = resourceManager.func_110536_a(textureLocation);
            inputStream = resource.func_110527_b();
            BufferedImage image = ImageIO.read(inputStream);
            return new DynamicTexture(image);
        }
        finally
        {
            if (inputStream != null)
            {
                inputStream.close();
            }
        }
    }
}
