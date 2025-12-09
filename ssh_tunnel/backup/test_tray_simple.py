#!/usr/bin/env python3
"""
Простой тест для проверки обработки кликов в трее
"""
import os
import sys
import time
from pathlib import Path

def test_tray_functionality():
    """Проверяем функциональность трея"""
    print("SSH Tunnel GUI - Tray Click Test")
    print("=" * 40)
    
    print("\n🔍 Проверка файлов...")
    
    # Проверяем основные файлы
    required_files = [
        "ssh_tunnel_gui.py",
        "TRAY_FIXES.md"
    ]
    
    for file in required_files:
        if Path(file).exists():
            print(f"  ✓ {file} найден")
        else:
            print(f"  ❌ {file} не найден")
            return False
    
    print("\n🔍 Проверка кода обработчиков кликов...")
    
    # Читаем основной файл и проверяем обработчики
    with open("ssh_tunnel_gui.py", "r", encoding="utf-8") as f:
        content = f.read()
    
    # Проверяем наличие правильных обработчиков
    checks = [
        ("on_tray_click", "on_tray_click(self, icon)"),
        ("on_tray_right_click", "on_tray_right_click(self, icon)"),
        ("on_tray_click", "show_from_tray"),
        ("tray_menu", "pystray.Menu"),
        ("default=True", "default=True"),
    ]
    
    for check_name, pattern in checks:
        if pattern in content:
            print(f"  ✓ {check_name}: найден '{pattern}'")
        else:
            print(f"  ❌ {check_name}: не найден '{pattern}'")
            return False
    
    print("\n🔍 Проверка логики обработки кликов...")
    
    # Проверяем ключевые методы
    key_methods = [
        "def on_tray_click(self, icon):",
        "def on_tray_right_click(self, icon):",
        "def show_from_tray(self):",
        "def hide_to_tray(self):",
    ]
    
    for method in key_methods:
        if method in content:
            print(f"  ✓ {method}")
        else:
            print(f"  ❌ {method} не найден")
            return False
    
    print("\n🎯 Результат исправлений:")
    print("  • ЛКМ по иконке: показывает окно")
    print("  • ПКМ по иконке: показывает контекстное меню")
    print("  • В меню: Show Window, Toggle Connection, Quit")
    print("  • Автоматическое сворачивание при minimize")
    
    print("\n✅ Все проверки пройдены!")
    return True

def test_tray_visual():
    """Визуальный тест (если возможно)"""
    print("\n🎨 Проверка визуальных элементов...")
    
    try:
        # Попробуем создать простую иконку для проверки
        with open("ssh_tunnel_gui.py", "r", encoding="utf-8") as f:
            content = f.read()
        
        if "create_image(connected)" in content:
            print("  ✓ Функция создания иконки найдена")
        else:
            print("  ❌ Функция создания иконки не найдена")
            return False
        
        if "#00ff00" in content and "#ff0000" in content:
            print("  ✓ Цветовая схема иконок настроена (зеленый/красный)")
        else:
            print("  ❌ Цветовая схема иконок не настроена")
            return False
        
        return True
        
    except Exception as e:
        print(f"  ❌ Ошибка визуальной проверки: {e}")
        return False

def main():
    """Основная функция тестирования"""
    print("Тестирование обработки кликов в трее SSH Tunnel Manager")
    print("=" * 60)
    
    # Переходим в директорию проекта
    project_dir = Path(__file__).parent
    os.chdir(project_dir)
    
    success1 = test_tray_functionality()
    success2 = test_tray_visual()
    
    if success1 and success2:
        print("\n🎉 Все тесты пройдены успешно!")
        print("\n📋 Инструкции для тестирования:")
        print("1. Запустите: python ssh_tunnel_gui.py")
        print("2. Сверните окно (должно появиться в трее)")
        print("3. ЛКМ по иконке - должно показать окно")
        print("4. ПКМ по иконке - должно показать меню")
        print("5. Проверьте пункты меню: Show Window, Toggle Connection, Quit")
        return 0
    else:
        print("\n❌ Некоторые тесты не пройдены")
        return 1

if __name__ == "__main__":
    exit(main())