import sqlalchemy as sql
from web import sql_database as db
from sqlalchemy.orm import relationship
from database.Alias import Alias
from database.Person import Person
import datetime


class Lecture(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    name = sql.Column(sql.String(256), nullable=False)
    folder = sql.Column(sql.String(256), nullable=True)
    link = sql.Column(sql.String(256), nullable=True)
    valid_until = sql.Column(sql.DateTime, nullable=True)
    alias = relationship(Alias, lazy="joined")
    persons = relationship(Person, lazy="joined")

    def to_dict(self):
        aliases = []
        for a in self.alias:
            aliases.append(a.to_dict())

        persons = []
        for a in self.persons:
            persons.append(a.to_dict())

        return {
            "id": self.id,
            "name": self.name,
            "folder": self.folder,
            "link": self.link,
            "validUntil": self.valid_until.strftime('%Y-%m-%dT%H:%M:%SZ') if self.valid_until is not None else "",
            "aliases": aliases,
            "persons": persons}
