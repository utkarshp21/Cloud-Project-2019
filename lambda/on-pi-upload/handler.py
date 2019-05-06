import json
import boto3
import rekognition_service
import dynamo_service
import rds_service

def hello(event, context):
    
    threshold = 85
    bucket_name = "surveillance-cam"
    collection_id = 'MyCollection'
    # rekognition_service.delete_collection(collection_id)
    # rekognition_service.create_collection(collection_id)
    
    bucket_keys = ["aa6911/aws_1.jpg"]
    # bucket_keys = ["asaggarw/aws_1.jpg", "asaggarw/aws_2.jpg", "aa6911/aws_1.jpg", "aa6911/aws_2.jpg", "aa6911/aws_3.jpg"]
    
    # bucket_name = event['Records'][0]['s3']['bucket']['name']
    # bucket_key = event['Records'][0]['s3']['object']['key']
    
    for bucket_key in bucket_keys:
        device_owner_id = bucket_key.split("/")[0]
        bucket_file_name = bucket_key.split("/")[1]
        print ('Bucket - ' + bucket_name)
        print("Owner - " + device_owner_id)
        print ('Bucket File Name - ' + bucket_key) 	
        indexed_face_records = rekognition_service.index_face(collection_id, bucket_name, bucket_key)
        for faceRecord in indexed_face_records:
            face_id = faceRecord['Face']['FaceId']
            response = rekognition_service.search_collection_using_face_id(collection_id, threshold, face_id)
            if response is None:
                # create user for face and add in dynamo user table
                matched_user_id = "user-" + face_id 
                rds_service.put_user_record(matched_user_id, device_owner_id, "")
            else :
                matched_face_id = response[0]['Face']['FaceId']
                matched_user_id = rds_service.get_user_id_for_image(matched_face_id, device_owner_id)
                # if matched_user_id is None:
                #     matched_user_id = "user-" + face_id 
                #     dynamo_service.put_user_record(matched_user_id, device_owner_id) 
            rds_service.put_face_record(face_id, matched_user_id, bucket_key, device_owner_id, 1557152593, -1)
    
    
    # matched_image_id = rekognition_service.search_collection(collection_id, threshold, bucket_name, bucket_key)
    # rekognition_service.list_faces(collection_id)
    
    body = {
        "message": "Go Serverless v1.0! Your function executed successfully!",
        "input": event
    }

    response = {
        "statusCode": 200,
        "body": json.dumps(body)
    }

    return response
