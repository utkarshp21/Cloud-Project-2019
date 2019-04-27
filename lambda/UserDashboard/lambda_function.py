import json

actionsMap = {
    "add_familiar_pic": add_familiar_pic,
    "search": search,
    }
    
def add_familiar_pic(s3_path, owner_id):
    
    indexed_face_records = rekognition_collection_service.index_face(collection_id, bucket_name, bucket_file_name)
    face_id = faceRecord['Face']['FaceId']
        response = rekognition_collection_service.search_collection_using_face_id(collection_id, threshold, face_id)
        if response is None:
            # create user for face and add in dynamo user table
            matched_user_id = "user-" + face_id 
            dynamo_service.put_user_record(matched_user_id, device_owner_id)
        else :
            matched_face_id = response[0]['Face']['FaceId']
            matched_user_id = dynamo_service.get_user_id_for_image(face_id, device_owner_id)
            print(matched_user_id)
            if matched_user_id is None:
                matched_user_id = "user-" + face_id 
                dynamo_service.put_user_record(matched_user_id, device_owner_id) 
        dynamo_service.put_face_record(face_id, matched_user_id, bucket_file_name, device_owner_id)


def lambda_handler(event, context):
    # TODO implement
    
    action = event['action']
    actionsMap[action]()
    
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
