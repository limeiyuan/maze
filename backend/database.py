import sqlite3

def save_resources(resources):
    conn = sqlite3.connect('resources.db')
    cursor = conn.cursor()
    
    # 创建资源表
    cursor.execute('''CREATE TABLE IF NOT EXISTS resources (id INTEGER PRIMARY KEY, name TEXT, path TEXT)''')
    
    # 插入资源数据
    for resource in resources:
        cursor.execute('''INSERT INTO resources (name, path) VALUES (?, ?)''', (resource['name'], resource['path']))
    
    conn.commit()
    conn.close()