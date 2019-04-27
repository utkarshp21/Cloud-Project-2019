import json
#Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
#PDX-License-Identifier: MIT-0 (For details, see https://github.com/awsdocs/amazon-rekognition-developer-guide/blob/master/LICENSE-SAMPLECODE.)
import boto3
import rekognition_collection_service
import dynamo_service


def lambda_handler(event, context):
    
    collection_id = 'MyCollection'
    threshold = 85
    device_owner_id = 'asaggarw'
    bucket_name = "surveillance-cam"
    #event['Records'][0]['s3']['bucket']['name']
    bucket_file_name = "aws_1.png"
    #event['Records'][0]['s3']['object']['key']
    print ('Bucket - ' + bucket_name) 	
    print ('Bucket File Name - ' + bucket_file_name) 	
    
    # rekognition_collection_service.delete_collection(collection_id)
    # rekognition_collection_service.create_collection(collection_id)
    indexed_face_records = rekognition_collection_service.index_face(collection_id, bucket_name, bucket_file_name)
    
    for faceRecord in indexed_face_records:
        face_id = faceRecord['Face']['FaceId']
        response = rekognition_collection_service.search_collection_using_face_id(collection_id, threshold, face_id)
        if response is None:
            # create user for face and add in dynamo user table
            matched_user_id = "user-" + face_id 
            dynamo_service.put_user_record(matched_user_id, device_owner_id)
        else :
            matched_face_id = response[0]['Face']['FaceId']
            matched_user_id = dynamo_service.get_user_id_for_image(face_id, device_owner_id)
            # if matched_user_id is None:
            #     matched_user_id = "user-" + face_id 
            #     dynamo_service.put_user_record(matched_user_id, device_owner_id) 
        dynamo_service.put_face_record(face_id, matched_user_id, bucket_file_name, device_owner_id)    
    # matched_image_id = rekognition_collection_service.search_collection(collection_id, threshold, bucket_name, bucket_file_name)
    # rekognition_collection_service.list_faces(collection_id)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
