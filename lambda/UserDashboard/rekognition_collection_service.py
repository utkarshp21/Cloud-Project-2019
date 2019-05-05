import boto3

def create_collection(collection_id):
    
    client = boto3.client('rekognition')
    #Create a collection
    print('Creating collection:' + collection_id)
    response = client.create_collection(CollectionId=collection_id)
    print('Collection ARN: ' + response['CollectionArn'])
    print('Status code: ' + str(response['StatusCode']))
    print('Done...')
    
def list_faces(collection_id):
    
    client = boto3.client('rekognition') 
    response=client.list_faces(CollectionId=collection_id)
    print("List Faces in Collection Response - ")
    for face in response['Faces']:
        print ("  FaceId : {} and ExternalImageId : {}".format(face['FaceId'], face['ExternalImageId']))
        # print ("  ImageId : {}".format(face['ImageId']))

def search_collection_using_face_id(collection_id, threshold, face_id):        
    
    client = boto3.client('rekognition') 
    
    response = client.search_faces(
        CollectionId = collection_id,
        FaceId = face_id,
        FaceMatchThreshold = threshold
    )  
    if len(response['FaceMatches']) > 0:
        return response['FaceMatches']
    else:
        return None
        
def search_collection_using_s3(collection_id, threshold,bucket, bucket_file_name):
	
	client = boto3.client('rekognition') 
	 
	response = client.search_faces_by_image(
		Image={
			"S3Object": {
				"Bucket": bucket,
				"Name": bucket_file_name,
			}
		},
		CollectionId=collection_id,
		FaceMatchThreshold=threshold
	)
	print("Search Collection Response - ")
	for record in response['FaceMatches']:
		face = record['Face']
		print ("  FaceId : {} and ExternalImageId : {}".format(face['FaceId'], face['ExternalImageId']))
		# print ("  ImageId : {}".format(face['ImageId']))
	
	if len(response['FaceMatches'][0]['Face']) > 0:
		return response['FaceMatches'][0]['Face']['FaceId']
	else:
		return None


def index_face(collection_id, bucket_name, bucket_file_name):
    
    client = boto3.client('rekognition') 
    response = client.index_faces(CollectionId = collection_id,
                                Image={'S3Object':{'Bucket':bucket_name,'Name':bucket_file_name}},
                                ExternalImageId=bucket_file_name,
                                DetectionAttributes=())
                                
    print("Index Face Response - ")
    for faceRecord in response['FaceRecords']:
        print ("  FaceId : {} and ExternalImageId : {}".format(faceRecord['Face']['FaceId'], faceRecord['Face']['ExternalImageId']))
        # print ("  ImageId : {}".format(faceRecord['Face']['ImageId']))


    if len(response['FaceRecords']) > 0:
        return response['FaceRecords']
    else:
        return None