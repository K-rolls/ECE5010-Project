'''Used solely to generate initial seed'''

import bcrypt
import uuid

password = b'password123'  # Password string to hash, must be bytes
cost_factor = 12  # Number of rounds for hashing, recommended value is between 10 and 14
name = "Moe"
# hashed_password = bcrypt.hashpw(password, bcrypt.gensalt(cost_factor))
# print(hashed_password.decode('utf-8'))

namespace_uuid = uuid.UUID("666f849c-326f-4922-8252-c97cef969af5")

user_id = uuid.uuid3(namespace_uuid, name)
print(f"user_id: {user_id}")
