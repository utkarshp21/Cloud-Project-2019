import json
#Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
#PDX-License-Identifier: MIT-0 (For details, see https://github.com/awsdocs/amazon-rekognition-developer-guide/blob/master/LICENSE-SAMPLECODE.)
import boto3
import rekognition_collection_service
import dynamo_service


def lambda_handler(event, context):
    threshold = 85
    bucket_name = "surveillance-cam"
    collection_id = 'MyCollection'
    # rekognition_collection_service.delete_collection(collection_id)
    # rekognition_collection_service.create_collection(collection_id)
    
    bucket_keys = ["asaggarw/aws_1.jpg"]
    # bucket_keys = ["asaggarw/aws_1.jpg", "asaggarw/aws_2.jpg", "aa6911/aws_1.jpg", "aa6911/aws_2.jpg", "aa6911/aws_3.jpg"]
    
    # bucket_name = event['Records'][0]['s3']['bucket']['name']
    # bucket_key = event['Records'][0]['s3']['object']['key']
    for bucket_key in bucket_keys:
        device_owner_id = bucket_key.split("/")[0]
        bucket_file_name = bucket_key.split("/")[1]
        print ('Bucket - ' + bucket_name)
        print("Owner - " + device_owner_id)
        print ('Bucket File Name - ' + bucket_key) 	
        indexed_face_records = rekognition_collection_service.index_face(collection_id, bucket_name, bucket_key)
        for faceRecord in indexed_face_records:
            face_id = faceRecord['Face']['FaceId']
            response = rekognition_collection_service.search_collection_using_face_id(collection_id, threshold, face_id)
            if response is None:
                # create user for face and add in dynamo user table
                matched_user_id = "user-" + face_id 
                dynamo_service.put_user_record(matched_user_id, device_owner_id)
            else :
                matched_face_id = response[0]['Face']['FaceId']
                matched_user_id = dynamo_service.get_user_id_for_image(matched_face_id, device_owner_id)
                # if matched_user_id is None:
                #     matched_user_id = "user-" + face_id 
                #     dynamo_service.put_user_record(matched_user_id, device_owner_id) 
            dynamo_service.put_face_record(face_id, matched_user_id, bucket_key, device_owner_id)    
    
    
    # matched_image_id = rekognition_collection_service.search_collection(collection_id, threshold, bucket_name, bucket_key)
    # rekognition_collection_service.list_faces(collection_id)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
