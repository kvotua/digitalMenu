from pynamodb.attributes import UnicodeAttribute
from pynamodb.models import Model

from app.schemas import TagId
from app.tags.schemas import Tag


class TagModel(Model):
    class Meta:
        table_name = "tags"
        host = "http://dynamodb:8000"
        region = "dummy"
        aws_access_key_id = "dummy"
        aws_secret_access_key = "dummy"

    id = UnicodeAttribute(hash_key=True)
    name = UnicodeAttribute()
    color = UnicodeAttribute()

    def to_schema(self) -> Tag:
        return Tag(
            id=TagId(self.id),
            name=self.name,
            color=self.color,
        )


if not TagModel.exists():
    TagModel.create_table(
        wait=True,
        read_capacity_units=1,
        write_capacity_units=1,
        billing_mode="PAY_PER_REQUEST",
    )
