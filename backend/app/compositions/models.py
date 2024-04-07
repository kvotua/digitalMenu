from pynamodb.attributes import JSONAttribute, UnicodeAttribute, UnicodeSetAttribute
from pynamodb.models import Model

from app.compositions.schemas import Composition, Point
from app.schemas import CompositionId, TagId


class CompositionModel(Model):
    class Meta:
        table_name = "tags"
        host = "http://dynamodb:8000"
        region = "dummy"
        aws_access_key_id = "dummy"
        aws_secret_access_key = "dummy"

    id = UnicodeAttribute(hash_key=True)
    tags = UnicodeSetAttribute()
    points = JSONAttribute()

    def to_schema(self) -> Composition:
        return Composition(
            id=CompositionId(self.id),
            tags=list(map(lambda x: TagId(x), self.tags))
            if self.tags is not None
            else [],
            points=[Point(**point) for point in self.points]
            if self.points is not None
            else [],
        )


if not CompositionModel.exists():
    CompositionModel.create_table(
        wait=True,
        read_capacity_units=1,
        write_capacity_units=1,
        billing_mode="PAY_PER_REQUEST",
    )
