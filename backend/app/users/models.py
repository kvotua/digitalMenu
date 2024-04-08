from pynamodb.attributes import UnicodeAttribute, UnicodeSetAttribute
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
    username = UnicodeAttribute()
    password = UnicodeAttribute()
    products_likes = UnicodeSetAttribute()
    compositions_likes = UnicodeSetAttribute()

    def to_schema(self) -> UserSchema:
        return UserSchema(
            id=UserId(self.id),
            username=self.username,
            password=self.password,
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
    user = UserSchema(username="admin")
    UserModel(
        id=user.id,
        username=user.username,
        products_likes=user.likes.products,
        compositions_likes=user.likes.compositions,
    ).save()
