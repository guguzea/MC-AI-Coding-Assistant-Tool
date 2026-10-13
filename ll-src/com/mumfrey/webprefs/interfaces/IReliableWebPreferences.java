package com.mumfrey.webprefs.interfaces;

/**
 * Reliable WebPreferences, no this isn't implemented yet
 *
 * @author Adam Mummery-Smith
 */
public interface IReliableWebPreferences extends IWebPreferences
{
    public void isSynchronised(String key);

    public void setWithNotify(String key, String value, IWebPreferencesListener listener);
}
