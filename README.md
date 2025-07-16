---
# 🚀 xxxkingxlcraft Custom Command System

Developed by **xxxkingxl**, published under **xxxkingxlcraft** and its sub-brand **xxxkingxlICT**.

A modular command framework designed to supercharge Windows environments with powerfull automation and optional Android device support via ADB — which is fully bundled. Free to use for personal and internal business systems (non-redistributable).

---

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

---

Certainly! Here's a refined version with clearer formatting, a friendlier tone, and a bit more guidance for users who might be new to ADB setups:

---

## 📱 Android Support (Optional)

Some commands in this system rely on **Android Debug Bridge (ADB)**, which is **fully bundled** in the `adb` folder — no need to download it separately. ADB allows for powerful Android device interactions, especially when paired with the [Shizuku](https://shizuku.moe/) app for near-root access (without rooting your device).

---

### 🔧 ADB Setup

- ✅ **No extra ADB installation needed** — the required binaries are prepackaged inside `ccmd/adb/`.
- 📁 Just add the `adb` folder to your system’s `Path` variable (see install guide above).
- 📲 To enable ADB communication, **you must install your phone’s device drivers**:
  - For **Samsung devices**, install the official Samsung USB drivers.
  - For other brands (e.g. Xiaomi, OnePlus, Google), visit the manufacturer’s website or use tools like [ADB Driver Installer](https://adbdriver.com/).
- ⚙️ Make sure your Android phone has **USB Debugging enabled** in Developer Options.

---

### ✨ Enable Shizuku (Advanced Android Access)

1. 📦 Install [Shizuku from F-Droid](https://f-droid.org/en/packages/moe.shizuku.privileged.api/)
2. 🔌 Connect your phone via USB with debugging enabled.
3. 🟦 In the Shizuku app, select **“Start via USB (ADB)”** mode.
4. 🛠️ Open your terminal or command window and run:
   ```Your Terminal
   adbse
   ```
5. 🔓 This activates elevated permissions for Android-related commands, without requiring root.

---


## 🧰 Features

- Manual folder-based install
- Custom command dispatching
- Android support with bundled ADB
- Windows focused (Linux support planned)

---

## 🖥️ Requirements

- Windows 10+
- Admin rights (for some commands)
- Android USB drivers (optional, per device)

---

## 📄 License

This project is licensed under a **custom EULA**. Redistribution and modification are prohibited.

✅ Internal business use allowed, including use on monetized systems  
📅 Effective Date: 16-07-2025 [DD-MM-YYYY]  
📜 [View License](LICENSE.md)

---

## 🛠️ Roadmap

- Linux compatibility
- UI-based installer
- --Modular plugin support-- (reason: if you add an terminal app (for windows its an .exe file) in the run directory, then its able to be used, but not registed in the help command)

---

## 💬 Author & Branding

**Developer:** xxxkingxl  
**Company:** xxxkingxlcraft  
**Publisher:** xxxkingxlICT

Questions, feedback, or suggestions? Open an issue or start a discussion.

---
```

If you want this styled as a splash page, landing doc, or need icons and branding, I’d be thrilled to help trick it out. Want a logo banner or visual README mockup next? 🧑‍💻🔥
