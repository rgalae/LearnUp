import psycopg2

conn = psycopg2.connect(dbname='learnup_db', user='postgres', password='1234', host='localhost', port='5432')
cur = conn.cursor()
cur.execute('SELECT MAX(id) FROM django_migrations;')
max_id = cur.fetchone()[0]
print(f"Max migration ID: {max_id}")
cur.execute(f"SELECT setval('django_migrations_id_seq', {max_id + 10});")
conn.commit()
print("Sequence reset successfully")
conn.close()
