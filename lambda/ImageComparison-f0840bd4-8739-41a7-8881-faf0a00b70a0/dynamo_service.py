import boto3

dynamodb = boto3.resource("dynamodb", region_name='us-east-1')
table = dynamodb.Table('images_cc_proj')

def get_user_id_for_image(image_id):
    
    try:
        response = table.get_item(
            Key={
                'image_id': image_id
            }
        )
    except Exception as e:
        print(e.response['Error']['Message'])
        return None
    else:
        item = response['Item']
        print ("Returning user id : {} for input image id : {}".format(item['user_id'], image_id))
        
        return item['user_id']
    
    