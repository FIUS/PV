import sqlite3
import os
from sqlite3.dbapi2 import Row


class SQLiteWrapper:
    def __init__(self):
        self.db_name = os.environ.get("db_name") if os.environ.get(
            "db_name") else "database.db"
        self.con = sqlite3.connect(self.db_name)
        self.__create_tables()

    def __create_tables(self):
        try:
            self.con.cursor().execute(
                '''CREATE TABLE links
                (link_secret text, link_name text, link_url text)'''
            )
            self.con.commit()
        except sqlite3.OperationalError as e:
            print(e)

    def store_links(self, secret, links, thread_safe=False):
        print("Secret commited:", secret)
        if thread_safe:
            temp_con = sqlite3.connect(self.db_name)
        else:
            temp_con = self.con

        for link in links:
            temp_con.cursor().execute('''INSERT INTO links values (?, ?, ?)''',
                                      (secret, link[0], link[1]))
        temp_con.commit()

        if thread_safe:
            temp_con.close()

    def load_links(self, secret):
        output = list()
        for link in self.con.cursor().execute('''SELECT  link_name, link_url FROM links WHERE link_secret=?''', [secret]):
            output.append(link)
        return output

    def load_all_links(self):
        output = dict()
        print("Getting links from Database")
        link_count = 0
        for link in self.con.cursor().execute('''SELECT * FROM links '''):
            if link[0] in output:
                output[link[0]].append([link[1], link[2]])
            else:
                output[link[0]] = [[link[1], link[2]]]
            link_count += 1
        print("Loaded", len(output), "Secrets", f"({link_count} Links)")
        return output

    def disconnect(self):
        self.con.commit()
        self.con.close()

    def test_db(self):
        self.store_links("aaa", [["test", "https://test.de"]])
        self.load_links("aaa")
