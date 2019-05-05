import json
#Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
#PDX-License-Identifier: MIT-0 (For details, see https://github.com/awsdocs/amazon-rekognition-developer-guide/blob/master/LICENSE-SAMPLECODE.)
import boto3
import rekognition_collection_service
import dynamo_service

def lambda_handler(event, context):
    
    collection_id = 'MyCollection'
    client = boto3.client('rekognition')
    threshold = 95
    bucket_name = "surveillance-cam"
    #event['Records'][0]['s3']['bucket']['name']
    bucket_file_name = "rux32bav_medium.jpg"
    #event['Records'][0]['s3']['object']['key']
    print ('Bucket - ' + bucket_name) 	
    print ('Bucket File Name - ' + bucket_file_name) 	
    
    matched_image_id = rekognition_collection_service.search_collection(collection_id, threshold, bucket_name, bucket_file_name)
    dynamodb = boto3.resource("dynamodb", region_name='us-east-1')
    table = dynamodb.Table('images_cc_proj')
    matched_user_id = dynamo_service.get_user_id_for_image(matched_image_id)
    
    # input_image_id = rekognition_collection_service.index_face(collection_id, bucket_name, bucket_file_name)
    if matched_image_id is not None:
        response = table.put_item(
            Item={
                'image_id': 'image-erfj-azxs',
                'user_id': matched_user_id,
            }
        )
        print("PutItem succeeded:")

    # rekognition_collection_service.list_faces(collection_id)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
