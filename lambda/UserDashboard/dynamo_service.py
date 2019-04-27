import boto3
import time

device_owner_id_field = 'owner_id'
face_id_field = 'face_id'

def get_user_id_for_image(face_id, device_owner_id):
    dynamodb = boto3.resource("dynamodb", region_name='us-east-1')
    table = dynamodb.Table('images_cc_proj')    
    try:
        response = table.get_item(
            Key={
                face_id_field : face_id,
                device_owner_id_field : device_owner_id,
            }
        )
    except Exception as e:
        print(e.response['Error']['Message'])
        return None
    else :
        if 'Item' in response:
            item = response['Item']
            print ("Returning user id : {} for input face_id id : {}".format(item['user_id'], face_id))
            return item['user_id']
    return None
    
def put_face_record(face_id, user_id, path, device_owner_id):
    dynamodb = boto3.resource("dynamodb", region_name='us-east-1')
    table = dynamodb.Table('images_cc_proj')    
    response = table.put_item(
        Item={
            face_id_field : face_id,
            'user_id': user_id,
            's3_path' : path,
            device_owner_id_field : device_owner_id,
        }
    )
    print("Put Face Record succeeded:")
    
def put_user_record(user_id, device_owner_id):
    dynamodb = boto3.resource("dynamodb", region_name='us-east-1')
    table = dynamodb.Table('users_cc_proj')    
    response = table.put_item(
        Item={
            'user_id': user_id,
            'tagged' : False,
            device_owner_id_field : device_owner_id,
        }
    )
    print("Put User Record succeeded:")
    