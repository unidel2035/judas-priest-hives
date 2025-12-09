#!/usr/bin/env python3
"""
Тест определения тёмной темы для KDE Plasma 6
"""

import os
import subprocess
import time
from pathlib import Path

def test_kde_theme_detection():
    """Тестирование различных способов определения темы KDE Plasma 6"""
    
    print("=== Тест определения темы KDE Plasma 6 ===\n")
    
    # 1. Проверка KDE конфигурационных файлов
    print("1. Проверка конфигурационных файлов KDE:")
    
    kdeglobals = Path.home() / ".config/kdeglobals"
    if kdeglobals.exists():
        print("   Файл kdeglobals найден")
        try:
            with open(kdeglobals, 'r') as f:
                content = f.read()
                print("   Содержимое kdeglobals:")
                for line in content.split('\n'):
                    if any(keyword in line.lower() for keyword in ['colorscheme', 'theme', 'dark']):
                        print(f"     {line}")
        except Exception as e:
            print(f"   Ошибка чтения kdeglobals: {e}")
    else:
        print("   Файл kdeglobals не найден")
    
    # 2. Проверка через qdbus
    print("\n2. Проверка через qdbus:")
    try:
        result = subprocess.run(
            ["qdbus", "org.kde.KGlobalSettings", "/KGlobalSettings", 
             "org.kde.KGlobalSettings.themeName"],
            capture_output=True,
            text=True,
            timeout=3
        )
        if result.returncode == 0:
            theme_name = result.stdout.strip()
            print(f"   Тема: {theme_name}")
            if "dark" in theme_name.lower():
                print("   ✓ Определена тёмная тема")
            else:
                print("   ✓ Определена светлая тема")
        else:
            print(f"   Ошибка qdbus: {result.stderr}")
    except Exception as e:
        print(f"   Ошибка qdbus: {e}")
    
    # 3. Проверка через kreadconfig6/kreadconfig5
    print("\n3. Проверка через kreadconfig:")
    for cmd in ["kreadconfig6", "kreadconfig5"]:
        try:
            result = subprocess.run(
                [cmd, "--group", "General", "--key", "ColorScheme"],
                capture_output=True,
                text=True,
                timeout=3
            )
            if result.returncode == 0:
                scheme = result.stdout.strip()
                print(f"   {cmd}: {scheme}")
                if "Dark" in scheme:
                    print(f"   ✓ {cmd}: тёмная тема")
                else:
                    print(f"   ✓ {cmd}: светлая тема")
                break
            else:
                print(f"   {cmd}: команда не найдена или ошибка")
        except Exception as e:
            print(f"   {cmd}: ошибка - {e}")
    
    # 4. Проверка переменных окружения
    print("\n4. Проверка переменных окружения:")
    kde_vars = ["KDE_FULL_SESSION", "KDE_SESSION_VERSION", "KDE_FULL_SESSION_VERSION"]
    for var in kde_vars:
        value = os.environ.get(var)
        if value:
            print(f"   {var}: {value}")
    
    # 5. Проверка через xrdb
    print("\n5. Проверка через xrdb:")
    try:
        result = subprocess.run(
            ["xrdb", "-query"],
            capture_output=True,
            text=True,
            timeout=2
        )
        if result.returncode == 0:
            bg_color = None
            for line in result.stdout.split('\n'):
                if 'background' in line.lower():
                    parts = line.split()
                    if len(parts) >= 2:
                        bg_color = parts[-1]
                        break
            
            if bg_color and bg_color.startswith("#"):
                print(f"   Цвет фона: {bg_color}")
                # Простая проверка яркости
                hex_color = bg_color[1:]
                if len(hex_color) >= 6:
                    try:
                        r = int(hex_color[0:2], 16)
                        g = int(hex_color[2:4], 16)
                        b = int(hex_color[4:6], 16)
                        brightness = (r + g + b) / 3
                        print(f"   Яркость: {brightness:.1f} (0-255)")
                        if brightness < 128:
                            print("   ✓ Тёмная тема (по яркости)")
                        else:
                            print("   ✓ Светлая тема (по яркости)")
                    except ValueError:
                        print("   Не удалось определить яркость")
            else:
                print("   Цвет фона не найден")
        else:
            print("   xrdb недоступен")
    except Exception as e:
        print(f"   Ошибка xrdb: {e}")
    
    # 6. Fallback - время суток
    print("\n6. Fallback - время суток:")
    current_hour = time.localtime().tm_hour
    print(f"   Текущий час: {current_hour}")
    if current_hour >= 19 or current_hour <= 7:
        print("   ✓ Тёмная тема (вечер/ночь)")
    else:
        print("   ✓ Светлая тема (день)")

if __name__ == "__main__":
    test_kde_theme_detection()
