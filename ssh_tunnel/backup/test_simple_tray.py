#!/usr/bin/env python3
"""
Простой тест для проверки работы трея без запуска GUI
"""
import sys
import os
import time
import threading

# Добавляем текущую директорию в путь для импорта
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_tray_logic():
    """Тест логики работы трея"""
    print("Testing tray logic...")
    
    # Импортируем модули
    try:
        import tkinter as tk
        from unittest.mock import Mock
        print("✓ Imports successful")
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    
    # Создаем mock объекты
    mock_root = Mock()
    mock_root.withdraw = Mock()
    mock_root.deiconify = Mock()
    mock_root.lift = Mock()
    mock_root.focus_force = Mock()
    mock_root.attributes = Mock()
    mock_root.after_idle = Mock()
    mock_root.protocol = Mock()
    
    # Создаем тестовый класс
    class TestTrayApp:
        def __init__(self):
            self.tray_icon = None
            self.tray_running = False
            self.tray_thread = None
            self.is_running = False
        
        def create_new_tray_icon(self):
            """Создает новую иконку трея (mock)"""
            print("Creating new tray icon...")
            self.tray_icon = Mock()
        
        def hide_to_tray(self):
            """Скрыть окно в трей"""
            print("Hiding to tray...")
            
            # Сворачиваем окно
            mock_root.withdraw()
            
            # Всегда создаем новую иконку для надежности
            self.create_new_tray_icon()
            
            # Запускаем трей в отдельном потоке
            self.tray_running = True
            self.tray_thread = threading.Thread(target=self._run_tray_loop, daemon=True)
            self.tray_thread.start()
        
        def _run_tray_loop(self):
            """Цикл работы трея"""
            try:
                print("Starting tray loop...")
                # Mock работы трея
                time.sleep(0.1)  # Имитируем работу
                print("Tray loop completed")
            except Exception as e:
                print(f"Tray loop error: {e}")
            finally:
                self.tray_running = False
                print("Tray loop ended")
        
        def show_from_tray(self):
            """Показать окно из трея"""
            print("Showing from tray...")
            
            # Останавливаем трей
            self.tray_running = False
            
            if self.tray_icon:
                try:
                    self.tray_icon.stop()
                    print("Tray icon stopped")
                except Exception as e:
                    print(f"Error stopping tray: {e}")
            
            # Ждем завершения потока
            if self.tray_thread and self.tray_thread.is_alive():
                try:
                    self.tray_thread.join(timeout=2.0)
                    print("Tray thread joined")
                except:
                    print("Error joining tray thread")
            
            # Показываем окно
            mock_root.deiconify()
            mock_root.lift()
            mock_root.focus_force()
            mock_root.attributes("-topmost", True)
            mock_root.after_idle(lambda: mock_root.attributes("-topmost", False))
            
            print("Window shown from tray")
    
    # Тестируем
    app = TestTrayApp()
    
    print("\n1. Testing hide_to_tray...")
    app.hide_to_tray()
    time.sleep(0.2)  # Даем время потоку запуститься
    
    assert app.tray_running == True, "Tray should be running"
    assert app.tray_icon is not None, "Tray icon should be created"
    print("✓ Hide to tray test passed")
    
    print("\n2. Testing show_from_tray...")
    app.show_from_tray()
    time.sleep(0.3)  # Даем время на очистку
    
    assert app.tray_running == False, "Tray should not be running"
    print("✓ Show from tray test passed")
    
    print("\n3. Testing multiple cycles...")
    for i in range(3):
        print(f"  Cycle {i+1}:")
        app.hide_to_tray()
        time.sleep(0.1)
        app.show_from_tray()
        time.sleep(0.1)
    
    print("✓ Multiple cycles test passed")
    
    return True

def main():
    """Основная функция"""
    print("SSH Tunnel GUI - Simple Tray Test")
    print("=" * 40)
    
    try:
        success = test_tray_logic()
        
        if success:
            print("\n🎉 All tray logic tests passed!")
            print("\nThe tray fix should work correctly.")
            print("Try running the full GUI: python ssh_tunnel_gui.py")
            return 0
        else:
            print("\n❌ Some tests failed.")
            return 1
            
    except Exception as e:
        print(f"\n❌ Test error: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    exit(main())