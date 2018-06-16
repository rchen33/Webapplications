import tempfile

# Cloud-safe of uuid, so that many cloned servers do not all use the same uuids.
from gluon.utils import web2py_uuid

# Here go your api methods.
@auth.requires_signature()
def add_image():
    image_id = db.user_images.insert(
        image_url = request.vars.image_url,
        price = request.vars.price
    )
    user_images = dict(
        id = image_id,
        price = request.vars.price,
        image_url = request.vars.image_url
    )  
    return response.json(dict(user_images=user_images
        )
    )   

# @auth.requires_signature()
def get_user_images():  
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    get_id = request.vars.get_id
    user_images = []
    images = db(db.user_images.created_by==get_id).select()
    for n, i in enumerate(images):
        if n < end_idx - start_idx:
            img = dict(
                id = i.id,
                price = i.price,
                created_on = i.created_on,
                created_by = i.created_by,
                image_url = i.image_url,
            )
        user_images.append(img)
    return response.json(dict(user_images=user_images))

def get_users():
    user_list = []
    for r in db(db.auth_user.id > 0).select():
        z = dict(
        id = r.id,    
        first_name = r.first_name,
        last_name = r.last_name,
        email = r.email,
        )
        user_list.append(z)
    return response.json(dict(user_list=user_list))

def set_price():
    image = db(db.user_images.id==request.vars.get_id).select().first()
    image.update_record(price=request.vars.price)
    return response.json(dict(price=request.vars.price))