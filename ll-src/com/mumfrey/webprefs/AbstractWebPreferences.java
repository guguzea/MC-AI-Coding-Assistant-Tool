package com.mumfrey.webprefs;

import java.util.Set;
import java.util.UUID;

import com.mumfrey.webprefs.interfaces.IWebPreferences;

/**
 * Common base class for online/offline web preferences
 */
abstract class AbstractWebPreferences implements IWebPreferences
{
    /**
     * Our UUID
     */
    protected final String uuid;
    
    /**
     * True if we are a private settings set
     */
    protected final boolean isPrivate;
    
    protected final boolean isReadOnly;

    AbstractWebPreferences(UUID uuid, boolean isPrivate, boolean isReadOnly)
    {
        this(uuid.toString(), isPrivate, isReadOnly);
    }
    
    AbstractWebPreferences(String uuid, boolean isPrivate, boolean isReadOnly)
    {
        this.uuid = uuid;
        this.isPrivate = isPrivate;
        this.isReadOnly = isReadOnly;
    }

    void onTick()
    {
        // stub for subclasses
    }

    /* (non-Javadoc)
     * @see com.mumfrey.webprefs.interfaces.IWebPreferences#getUUID()
     */
    @Override
    public final String getUUID()
    {
        return this.uuid;
    }

    /* (non-Javadoc)
     * @see com.mumfrey.webprefs.interfaces.IWebPreferences#isPrivate()
     */
    @Override
    public final boolean isPrivate()
    {
        return this.isPrivate;
    }

    /* (non-Javadoc)
     * @see com.mumfrey.webprefs.interfaces.IWebPreferences#isReadOnly()
     */
    @Override
    public final boolean isReadOnly()
    {
        return this.isReadOnly;
    }

    /* (non-Javadoc)
     * @see com.mumfrey.webprefs.interfaces.IWebPreferences
     *      #request(java.lang.String)
     */
    @Override
    public void request(String key)
    {
        WebPreferences.validateKey(key);
    }

    /* (non-Javadoc)
     * @see com.mumfrey.webprefs.interfaces.IWebPreferences
     *      #request(java.lang.String[])
     */
    @Override
    public void request(String... keys)
    {
        if (keys == null || keys.length < 1) return;
        if (keys.length == 1) this.request(keys[0]);
        
        for (String key : keys)
        {
            this.request(key);
        }
    }

    /* (non-Javadoc)
     * @see com.mumfrey.webprefs.interfaces.IWebPreferences
     *      #request(java.util.Set)
     */
    @Override
    public void request(Set<String> keys)
    {
        if (keys == null || keys.size() < 1) return;
        
        for (String key : keys)
        {
            this.request(key);
        }
    }

    /* (non-Javadoc)
     * @see com.mumfrey.webprefs.interfaces.IWebPreferences#commit(boolean)
     */
    @Override
    public void commit(boolean force)
    {
    }

    /* (non-Javadoc)
     * @see com.mumfrey.webprefs.interfaces.IWebPreferences
     *      #set(java.lang.String, java.lang.String)
     */
    @Override
    public void set(String key, String value)
    {
        WebPreferences.validateKey(key);
    }

    /* (non-Javadoc)
     * @see com.mumfrey.webprefs.interfaces.IWebPreferences
     *      #remove(java.lang.String)
     */
    @Override
    public void remove(String key)
    {
        this.set(key, "");
    }
}
