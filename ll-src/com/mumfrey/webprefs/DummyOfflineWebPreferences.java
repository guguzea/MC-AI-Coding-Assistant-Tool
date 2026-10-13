package com.mumfrey.webprefs;

import java.util.UUID;

/**
 * No-op webpreferences set which is returned for nonlocal players when the
 * client is running in offline mode.
 */
public class DummyOfflineWebPreferences extends AbstractWebPreferences
{
    DummyOfflineWebPreferences(UUID uuid, boolean isPrivate, boolean isReadOnly)
    {
        this(uuid.toString(), isPrivate, isReadOnly);
    }
    
    public DummyOfflineWebPreferences(String uuid, boolean isPrivate, boolean isReadOnly)
    {
        super(uuid, isPrivate, isReadOnly);
    }

    /* (non-Javadoc)
     * @see com.mumfrey.webprefs.interfaces.IWebPreferences#poll()
     */
    @Override
    public void poll()
    {
    }

    /* (non-Javadoc)
     * @see com.mumfrey.webprefs.interfaces.IWebPreferences
     *      #has(java.lang.String)
     */
    @Override
    public boolean has(String key)
    {
        WebPreferences.validateKey(key);
        return false;
    }

    /* (non-Javadoc)
     * @see com.mumfrey.webprefs.interfaces.IWebPreferences
     *      #get(java.lang.String)
     */
    @Override
    public String get(String key)
    {
        WebPreferences.validateKey(key);
        return "";
    }

    /* (non-Javadoc)
     * @see com.mumfrey.webprefs.interfaces.IWebPreferences
     *      #get(java.lang.String, java.lang.String)
     */
    @Override
    public String get(String key, String defaultValue)
    {
        WebPreferences.validateKey(key);
        return defaultValue;
    }
}
