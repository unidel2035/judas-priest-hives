#!/usr/bin/env python3
"""
Тест для проверки сохранения состояния подключения
"""
import json
import os
import sys
from pathlib import Path

# Добавляем путь к модулю
sys.path.insert(0, '/home/dima/Projects/ssh_tunnel')

def test_save_connection_state():
    """Тестирует функцию сохранения состояния подключения"""
    from ssh_tunnel_gui import SSHTunnelApp
    import tkinter as tk
    
    print("🧪 Тестирование сохранения состояния подключения")
    print("=" * 60)
    
    # Создаем временное окно для тестирования
    root = tk.Tk()
    root.withdraw()  # Скрываем окно
    
    try:
        # Создаем экземпляр приложения
        app = SSHTunnelApp(root, start_minimized=False)
        
        # Тест 1: Сохраняем состояние "подключено"
        print("\n1️⃣ Тест сохранения состояния 'подключено':")
        app.save_connection_state(True)
        
        # Проверяем конфиг
        if app.config_file.exists():
            with open(app.config_file, "r") as f:
                config = json.load(f)
            was_connected = config.get("last_settings", {}).get("was_connected", False)
            print(f"   Результат: was_connected = {was_connected}")
            if was_connected:
                print("   ✅ PASS: Состояние 'подключено' сохранено корректно")
            else:
                print("   ❌ FAIL: Состояние 'подключено' НЕ сохранено")
        
        # Тест 2: Сохраняем состояние "отключено"
        print("\n2️⃣ Тест сохранения состояния 'отключено':")
        app.save_connection_state(False)
        
        # Проверяем конфиг
        if app.config_file.exists():
            with open(app.config_file, "r") as f:
                config = json.load(f)
            was_connected = config.get("last_settings", {}).get("was_connected", True)
            print(f"   Результат: was_connected = {was_connected}")
            if not was_connected:
                print("   ✅ PASS: Состояние 'отключено' сохранено корректно")
            else:
                print("   ❌ FAIL: Состояние 'отключено' НЕ сохранено")
        
        # Тест 3: Проверяем функцию восстановления
        print("\n3️⃣ Тест функции check_restore_connection:")
        
        # Устанавливаем тестовые настройки
        app.save_connection_state(True)
        app.restore_connection = True
        app.auto_reconnect = True
        
        # Устанавливаем тестовые настройки подключения
        app.host_entry.delete(0, tk.END)
        app.host_entry.insert(0, "test.example.com")
        app.username_entry.delete(0, tk.END)
        app.username_entry.insert(0, "testuser")
        app.restore_connection_var.set(True)
        app.auto_reconnect_var.set(True)
        
        # Выполняем проверку восстановления
        print("   Выполняем check_restore_connection()...")
        app.check_restore_connection()
        
        print("   ✅ PASS: Функция check_restore_connection выполнена без ошибок")
        
    except Exception as e:
        print(f"   ❌ FAIL: Ошибка при тестировании: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        root.destroy()
    
    print("\n" + "=" * 60)
    print("🏁 Тест завершен")

if __name__ == "__main__":
    test_save_connection_state()
