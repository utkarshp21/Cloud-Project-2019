import json
import boto3
import rekognition_service
import dynamo_service
import rds_service
import notification_service
import time

s3_client = boto3.client('s3')
threshold = 85
# bucket_keys = ["asaggarw/aws_1.jpg", "asaggarw/aws_2.jpg", "aa6911/aws_1.jpg", "aa6911/aws_2.jpg", "aa6911/aws_3.jpg"]

def index_image(bucket_name, bucket_key, collection_id, timestamp, tagged, user_name):
    device_owner_id = bucket_key.split("/")[0]
    bucket_file_name = bucket_key.split("/")[1]
    print ('Bucket - %s' % bucket_name)
    print("Owner - %s" % device_owner_id)
    print ('Bucket File Name - %s' % bucket_key) 	
    indexed_face_records = rekognition_service.index_face(collection_id, bucket_name, bucket_key)
    if indexed_face_records is None: 
        return None
    for faceRecord in indexed_face_records:
        face_id = faceRecord['Face']['FaceId']
        bounding_box = faceRecord['Face']['BoundingBox']
        height = bounding_box['Height']
        width = bounding_box['Width']
        top = bounding_box['Top']
        left = bounding_box['Left']
        bounding_box_str = ','.join(str(e) for e in [width, height, left, top])
        response = rekognition_service.search_collection_using_face_id(collection_id, threshold, face_id)
        if response is None:
            # create user for face and add in dynamo user table
            matched_user_id = "user-" + face_id 
            rds_service.put_user_record(matched_user_id, device_owner_id, tagged, user_name)
        else :
            matched_face_id = response[0]['Face']['FaceId']
            matched_user_id = rds_service.get_user_id_for_image(matched_face_id, device_owner_id)
            # if matched_user_id is None:
            #     matched_user_id = "user-" + face_id 
            #     dynamo_service.put_user_record(matched_user_id, device_owner_id) 
        rds_service.put_face_record(face_id, matched_user_id, bucket_key, device_owner_id, bounding_box_str, timestamp, -1)
    return True

def uploadPiImages(event, context):
    
    collection_id = 'MyCollection'
    
    # rekognition_service.delete_collection(collection_id)
    # rekognition_service.create_collection(collection_id)
    
    bucket_name = "surveillance-cam"
    bucket_key = "aa6911/1557583951.png"
    # bucket_name = event['Records'][0]['s3']['bucket']['name']
    # bucket_key = event["Records"][0]["s3"]["object"]["key"]
    print("Received bucket name[%s], bucket key[%s]" % (bucket_name, bucket_key))
    timestamp = str(time.time()).split(".")[0]
    print("Timestamp[%s] " % timestamp)

    response = s3_client.head_object(Bucket=bucket_name, Key=bucket_key)
    user_name = ""
    tagged = False
    if 'Metadata' in response and 'user-name' in response['Metadata'] :
        tagged = True
        user_name = response['Metadata']['user-name']
    print("User Name Received[%s]" % user_name)
    response = index_image(bucket_name, bucket_key, collection_id, timestamp, tagged, user_name)
    if response is not None:
        recipient = "ashim.agg93@gmail.com"
        notification_service.send_email_with_s3(recipient, "User name", bucket_name, bucket_key)
    response = {
        "statusCode": 200,
        "body": "Success"
    }
    return response