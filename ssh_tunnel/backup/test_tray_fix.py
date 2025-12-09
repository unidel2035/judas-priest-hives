#!/usr/bin/env python3
"""
Тест для проверки исправлений управления треем в SSH Tunnel GUI
"""
import sys
import os
import time
import threading
from unittest.mock import Mock, patch

# Добавляем текущую директорию в путь для импорта
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_tray_initialization():
    """Тест инициализации трея"""
    print("Testing tray initialization...")
    
    # Мокаем tkinter и pystray для теста
    with patch('tkinter.Tk'), \
         patch('ssh_tunnel_gui.pystray'), \
         patch('ssh_tunnel_gui.Image'), \
         patch('ssh_tunnel_gui.ImageDraw'):
        
        from ssh_tunnel_gui import SSHTunnelApp
        
        # Создаем mock root
        mock_root = Mock()
        mock_root.title = Mock()
        mock_root.geometry = Mock()
        mock_root.resizable = Mock()
        mock_root.configure = Mock()
        mock_root.protocol = Mock()
        mock_root.bind = Mock()
        mock_root.tk = Mock()
        mock_root.tk.call = Mock()
        
        app = SSHTunnelApp(mock_root)
        
        # Проверяем что трей правильно инициализирован
        assert app.tray_icon is not None, "Tray icon should be initialized"
        assert app.tray_running == False, "Tray should not be running initially"
        assert app.tray_thread is None, "Tray thread should be None initially"
        
        print("✓ Tray initialization test passed")

def test_tray_state_management():
    """Тест управления состоянием трея"""
    print("Testing tray state management...")
    
    with patch('tkinter.Tk'), \
         patch('ssh_tunnel_gui.pystray'), \
         patch('ssh_tunnel_gui.Image'), \
         patch('ssh_tunnel_gui.ImageDraw'):
        
        from ssh_tunnel_gui import SSHTunnelApp
        
        mock_root = Mock()
        mock_root.title = Mock()
        mock_root.geometry = Mock()
        mock_root.resizable = Mock()
        mock_root.configure = Mock()
        mock_root.protocol = Mock()
        mock_root.bind = Mock()
        mock_root.tk = Mock()
        mock_root.tk.call = Mock()
        mock_root.withdraw = Mock()
        mock_root.deiconify = Mock()
        mock_root.lift = Mock()
        mock_root.focus_force = Mock()
        mock_root.attributes = Mock()
        mock_root.after_idle = Mock()
        
        app = SSHTunnelApp(mock_root)
        
        # Мокаем поток трея
        mock_thread = Mock()
        mock_thread.is_alive.return_value = False
        app.tray_thread = mock_thread
        
        # Тест hide_to_tray
        app.hide_to_tray()
        
        # Проверяем что состояние правильно установлено
        assert app.tray_running == True, "Tray should be running after hide_to_tray"
        
        # Тест show_from_tray
        app.tray_running = True
        app.show_from_tray()
        
        assert app.tray_running == False, "Tray should not be running after show_from_tray"
        
        print("✓ Tray state management test passed")

def test_tray_thread_cleanup():
    """Тест корректной очистки потоков трея"""
    print("Testing tray thread cleanup...")
    
    with patch('tkinter.Tk'), \
         patch('ssh_tunnel_gui.pystray'), \
         patch('ssh_tunnel_gui.Image'), \
         patch('ssh_tunnel_gui.ImageDraw'):
        
        from ssh_tunnel_gui import SSHTunnelApp
        
        mock_root = Mock()
        mock_root.title = Mock()
        mock_root.geometry = Mock()
        mock_root.resizable = Mock()
        mock_root.configure = Mock()
        mock_root.protocol = Mock()
        mock_root.bind = Mock()
        mock_root.tk = Mock()
        mock_root.tk.call = Mock()
        mock_root.withdraw = Mock()
        mock_root.deiconify = Mock()
        mock_root.lift = Mock()
        mock_root.focus_force = Mock()
        mock_root.attributes = Mock()
        mock_root.after_idle = Mock()
        mock_root.quit = Mock()
        mock_root.destroy = Mock()
        
        app = SSHTunnelApp(mock_root)
        
        # Мокаем поток трея
        mock_thread = Mock()
        mock_thread.is_alive.return_value = False
        app.tray_thread = mock_thread
        app.tray_running = True
        
        # Тест cleanup_and_quit
        app.cleanup_and_quit()
        
        # Проверяем что очистка прошла корректно
        assert app.tray_running == False, "Tray should be stopped"
        
        print("✓ Tray thread cleanup test passed")

def main():
    """Запуск всех тестов"""
    print("Running SSH Tunnel GUI tray fix tests...\n")
    
    try:
        test_tray_initialization()
        test_tray_state_management()
        test_tray_thread_cleanup()
        
        print("\n🎉 All tests passed! Tray fix is working correctly.")
        return 0
        
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    exit(main())