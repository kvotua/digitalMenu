from pynamodb.attributes import NumberAttribute, UnicodeAttribute
from pynamodb.models import Model

from app.products.schemas import Product
from app.schemas import ProductId


class ProductModel(Model):
    class Meta:
        table_name = "products"
        host = "http://dynamodb:8000"
        region = "dummy"
        aws_access_key_id = "dummy"
        aws_secret_access_key = "dummy"

    id = UnicodeAttribute(hash_key=True)
    name = UnicodeAttribute()
    description = UnicodeAttribute()
    price = NumberAttribute()
    likes = NumberAttribute()

    def to_schema(self) -> Product:
        return Product(
            id=ProductId(self.id),
            name=self.name,
            description=self.description,
            price=int(self.price),
            likes=int(self.likes),
        )


if not ProductModel.exists():
    ProductModel.create_table(
        wait=True,
        read_capacity_units=1,
        write_capacity_units=1,
        billing_mode="PAY_PER_REQUEST",
    )
