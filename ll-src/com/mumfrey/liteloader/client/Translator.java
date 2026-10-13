/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client;

import com.mumfrey.liteloader.api.TranslationProvider;

import net.minecraft.client.resources.I18n;

public class Translator implements TranslationProvider
{
    /* (non-Javadoc)
     * @see com.mumfrey.liteloader.api.TranslationProvider#translate(
     *      java.lang.String, java.lang.Object[])
     */
    @Override
    public String translate(String key, Object... args)
    {
        // TODO doesn't currently honour the contract of TranslationProvider::translate, should return null if translation is missing
        return I18n.func_135052_a(key, args);
    }

    /* (non-Javadoc)
     * @see com.mumfrey.liteloader.api.TranslationProvider#translate(
     *      java.lang.String, java.lang.String, java.lang.Object[])
     */
    @Override
    public String translate(String locale, String key, Object... args)
    {
        // TODO doesn't currently honour the contract of TranslationProvider::translate, should return null if translation is missing
        return I18n.func_135052_a(key, args);
    }
}
