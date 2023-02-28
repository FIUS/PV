import sqlalchemy as sql
from web import sql_database as db
from sqlalchemy.orm import relationship


class Link(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    name = sql.Column(sql.String(256), nullable=False)
    link = sql.Column(sql.String(256), nullable=False)
    share_id = sql.Column(sql.Integer, sql.ForeignKey(
        'share.id'), nullable=False)

    def __str__(self) -> str:
        return self.link
