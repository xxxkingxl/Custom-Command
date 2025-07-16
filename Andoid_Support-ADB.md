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
```your terminal
adbse
```
5. 🔓 This activates elevated permissions for Android-related commands, without requiring root.
Note: if you have ADB already installed, you just ignore the adb folder and then you just do NOT add the adb folder to the path variable, because its already added to the path variable and otherwise going to conflict with your current install of ADB, the custom Command System is going to pick up the current install of ADB instead of the included one
