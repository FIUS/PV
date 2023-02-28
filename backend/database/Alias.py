import sqlalchemy as sql
from web import sql_database as db
from sqlalchemy.orm import relationship


class Alias(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    name = sql.Column(sql.String(256), nullable=False)
    lecture_id = sql.Column(sql.Integer, sql.ForeignKey(
        'lecture.id'), nullable=False)

    def to_dict(self):
        return {"id": self.id, "name": self.name}
