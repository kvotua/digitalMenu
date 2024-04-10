import bcrypt
from pydantic_extra_types.phone_numbers import PhoneNumber
from pynamodb.attributes import MapAttribute, UnicodeAttribute, UnicodeSetAttribute
from pynamodb.models import Model

from app.schemas import CompositionId, ProductId, UserId
from app.users.schemas import User as UserSchema
from app.users.schemas import UserLikes


class UserModel(Model):
    class Meta:
        table_name = "users"
        host = "http://dynamodb:8000"
        region = "dummy"
        aws_access_key_id = "dumme"
        aws_secret_access_key = "dummy"

    id = UnicodeAttribute(hash_key=True)
    products_likes = UnicodeSetAttribute()
    compositions_likes = UnicodeSetAttribute()
    cart: MapAttribute[ProductId, int] = MapAttribute()

    username = UnicodeAttribute(null=True)
    password = UnicodeAttribute(null=True)
    name = UnicodeAttribute(null=True)
    surname = UnicodeAttribute(null=True)
    email = UnicodeAttribute(null=True)
    phone = UnicodeAttribute(null=True)

    def to_schema(self) -> UserSchema:
        return UserSchema(
            id=UserId(self.id),
            username=self.username,
            password=self.password,
            name=self.name,
            surname=self.surname,
            email=self.email,
            phone=PhoneNumber(self.phone) if self.phone is not None else None,
            cart=self.cart.as_dict() if self.cart else {},
            likes=UserLikes(
                products=(
                    list(
                        map(lambda x: ProductId(x), self.products_likes),
                    )
                    if self.products_likes is not None
                    else []
                ),
                compositions=(
                    list(
                        map(lambda x: CompositionId(x), self.compositions_likes),
                    )
                    if self.compositions_likes is not None
                    else []
                ),
            ),
        )


if not UserModel.exists():
    UserModel.create_table(
        wait=True,
        read_capacity_units=1,
        write_capacity_units=1,
        billing_mode="PAY_PER_REQUEST",
    )

if len(list(UserModel.scan(UserModel.username == "admin"))) == 0:
    UserModel(
        id="00000000-0000-0000-0000-000000000000",
        username="admin",
        password=bcrypt.hashpw(b"admin", bcrypt.gensalt()).decode(),
    ).save()
