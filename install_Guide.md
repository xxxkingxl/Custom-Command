## 📦 Installation Guide

### 1️⃣ Download & Placement

1. **Download the latest release ZIP** from the [Releases](https://github.com/yourusername/yourrepo/releases) section.
2. **Extract** the contents of the ZIP file.
3. **Move** the extracted folder named: ``ccmd`` to the root of your user directory:

   ```
   C:\Users\YourUsername\ccmd\
   ```

> ⚠️ Do **not** rename folders or relocate their contents. The system relies on consistent paths.

---

### 2️⃣ Configure Environment Variables (`Path`)

To run tools and commands from any location, expose the `run` and `adb` folders to your system’s environment variables.

1. Press `Win + R`, type `sysdm.cpl`, press Enter.
2. Go to the **Advanced** tab → Click **Environment Variables**.
3. Under **System Variables**, find `Path` → Click **Edit**.
4. Add two new entries:
   - `C:\Users\YourUsername\ccmd\run`
   - `C:\Users\YourUsername\ccmd\adb`
5. Click OK to apply changes.

This enables global access to custom commands and ADB functions.

**Note: if you have ADB already installed, you just ignore the adb folder and then you just do NOT add the adb folder to the path variable, 
because its already added to the path variable and otherwise going to conflict with your current install of ADB, the custom Command System is going to pick up the current install of ADB instead of the included one**
